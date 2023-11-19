import {Server} from 'socket.io';
import {verifyJWT} from '../utils/jwt.util';
import ExamSessionModel from '../models/exam-session.model';
import ExamModel from '../models/exam.model';
import mongoose, {isObjectIdOrHexString} from 'mongoose';
import ExamQuestionModel from '../models/exam-question.model';
import ESQuestionModel from '../models/exam-session-question.model';
import ESAnswerModel from '../models/exam-session-answer.model';
const ObjectId = mongoose.Types.ObjectId;

export const examSocketController = (io: Server) => {
  const examNamespace = io.of(/^\/exam\/[a-zA-Z0-9_]+$/);
  examNamespace.on('connection', async socket => {
    let time_left = 0;
    let interval: NodeJS.Timeout;
    let inSession = false;
    const student_id = socket.nsp.name.split('/')[2];
    const token = socket.handshake.headers.authorization?.split(' ')[1];
    const data = verifyJWT(token as string);
    if (
      data &&
      data.iss === 'krendus-exam-server' &&
      data.type === 'student' &&
      student_id === data.data.id
    ) {
      socket.emit('connected', {
        message: 'Student connected to exam server',
      });
      socket.on('start-exam', async ({exam_id}: {exam_id: string}) => {
        if (inSession) return;
        try {
          inSession = true;
          if (!isObjectIdOrHexString(exam_id)) {
            socket.emit('notify', {
              message: 'Invalid exam id',
            });
          } else {
            const exam = await ExamModel.findOne({
              _id: new ObjectId(exam_id),
              school_id: data.data.school_id,
            });
            if (!exam?.class_ids.includes(data.data.class)) {
              inSession = false;
              socket.emit('notify', {
                message: 'Student not in the class that can take the exam',
              });
              return;
            }
            if (!exam?.is_available) {
              inSession = false;
              socket.emit('notify', {
                message: 'Exam not available',
              });
              return;
            }
            if (exam) {
              const examSession = await ExamSessionModel.findOne({
                school_id: data.data.school_id,
                exam_id,
                student_id,
              });
              if (examSession) {
                time_left = examSession.time_left ?? 0;
                if (examSession.is_ended) {
                  socket.emit('exam-ended', {
                    message: 'exam ended',
                  });
                  return;
                }
                const sessionQuestions = await ESQuestionModel.findOne({
                  exam_session_id: examSession.id,
                });
                const sessionAnswer = await ESAnswerModel.findOne({
                  exam_session_id: examSession.id,
                });
                const refinedAnswers = sessionAnswer?.answers.map(ans => {
                  return {
                    question_id: ans.exam_question,
                    answer: ans.selected_answer,
                  };
                });
                socket.on('submit', async answers => {
                  const sessionAnswer: any = await ESAnswerModel.findOne({
                    exam_session_id: examSession.id,
                  });
                  const filteredAnswers = answers.filter((ans: any) => {
                    return (
                      (sessionQuestions?.questions?.findIndex(
                        ques => ques.question_id === ans.question_id
                      ) as any) > -1
                    );
                  });
                  sessionAnswer.answers = new mongoose.Types.DocumentArray(
                    filteredAnswers.map((ans: any) => {
                      return {
                        exam_question: new ObjectId(ans.question_id),
                        selected_answer: ans.answer,
                      };
                    })
                  );
                  await sessionAnswer.save();
                  examSession.time_left = time_left;
                  examSession.is_ended = true;
                  examSession.end_time = Date.now();
                  clearInterval(interval);
                  await examSession.save();
                  socket.emit('exam-ended', {
                    message: 'exam ended',
                  });
                });
                socket.on('submit-answer', async ({question_id, answer}) => {
                  const sessionAnswer = await ESAnswerModel.findOne({
                    exam_session_id: examSession.id,
                  });
                  if (sessionAnswer) {
                    const answers = sessionAnswer.answers.map(ans => {
                      return {
                        exam_question: ans.exam_question,
                        selected_answer: ans.selected_answer,
                      };
                    });
                    const answerIdx = answers.findIndex(ans => {
                      return ans?.exam_question?.toString() === question_id;
                    });
                    const questionIdx = sessionQuestions?.questions.findIndex(
                      (q: any) => q.question_id === question_id
                    );
                    if (questionIdx === -1) {
                      socket.emit('info', {
                        message: 'Question not assigned to student',
                      });
                      return;
                    }
                    if (answerIdx > -1) {
                      answers[answerIdx] = {
                        ...answers[answerIdx],
                        selected_answer: answer,
                      };
                    } else {
                      answers.push({
                        exam_question: new ObjectId(question_id),
                        selected_answer: answer,
                      });
                    }
                    sessionAnswer.answers = new mongoose.Types.DocumentArray(
                      answers
                    );
                    await sessionAnswer.save();
                  } else {
                    socket.emit('info', {message: 'Session not found'});
                  }
                });
                socket.emit('exam-started', {
                  message: 'exam started',
                  data: {
                    exam_session_id: examSession._id,
                    exam_name: exam.name,
                    duration: exam.duration,
                    questions: sessionQuestions?.questions,
                    answers: refinedAnswers ?? [],
                  },
                });
                socket.on('disconnect', async () => {
                  examSession.time_left = time_left;
                  await examSession.save();
                });
                interval = setInterval(async () => {
                  if (time_left > 0) {
                    socket.emit('time-left', {
                      time_left,
                    });
                    time_left--;
                  } else {
                    clearInterval(interval);
                    examSession.time_left = 0;
                    examSession.end_time = Date.now();
                    examSession.is_ended = true;
                    await examSession.save();
                    socket.emit('exam-ended', {
                      message: 'exam ended',
                    });
                  }
                }, 1000);
              } else {
                const examSession = await ExamSessionModel.create({
                  exam_id,
                  time_left: exam.duration * 60,
                  start_time: Date.now(),
                  student_id: data.data.id,
                  school_id: data.data.school_id,
                  is_ended: false,
                });
                if (examSession) {
                  time_left = examSession.time_left ?? 0;
                  let questions = await ExamQuestionModel.aggregate([
                    {$match: {exam_id}},
                    {$sample: {size: exam.to_answer ?? 1}},
                  ]);
                  questions = questions.map(question => {
                    return {
                      question_id: question._id,
                      options: question.options,
                      question: question.question,
                      type: question.type,
                    };
                  });
                  await ESQuestionModel.create({
                    exam_session_id: examSession.id,
                    questions,
                  });

                  await ESAnswerModel.create({
                    exam_session_id: examSession.id,
                    exam_id: examSession.exam_id,
                    school_id: data.data.school_id,
                    student: new ObjectId(data.data.id),
                    answers: [],
                  });

                  // handles submit answer
                  socket.on('submit-answer', async ({question_id, answer}) => {
                    ``;
                    const sessionAnswer = await ESAnswerModel.findOne({
                      exam_session_id: examSession.id,
                    });
                    if (sessionAnswer) {
                      const answers = sessionAnswer.answers.map(ans => {
                        return {
                          exam_question: ans.exam_question,
                          selected_answer: ans.selected_answer,
                        };
                      });
                      const answerIdx = answers.findIndex(ans => {
                        return ans?.exam_question?.toString() === question_id;
                      });
                      const questionIdx = questions.findIndex(
                        (q: any) => q.question_id === question_id
                      );
                      if (questionIdx === -1) {
                        socket.emit('info', {
                          message: 'Question not assigned to student',
                        });
                        return;
                      }
                      if (answerIdx > -1) {
                        answers[answerIdx] = {
                          ...answers[answerIdx],
                          selected_answer: answer,
                        };
                      } else {
                        answers.push({
                          exam_question: new ObjectId(question_id),
                          selected_answer: answer,
                        });
                      }
                      sessionAnswer.answers = new mongoose.Types.DocumentArray(
                        answers
                      );
                      await sessionAnswer.save();
                    } else {
                      socket.emit('info', {message: 'Session not found'});
                    }
                  });

                  // handles submitting of answer
                  socket.on('submit', async answers => {
                    const sessionQuestions = await ESQuestionModel.findOne({
                      exam_session_id: examSession.id,
                    });
                    const sessionAnswer: any = await ESAnswerModel.findOne({
                      exam_session_id: examSession.id,
                    });
                    const filteredAnswers = answers.filter((ans: any) => {
                      return (
                        (sessionQuestions?.questions?.findIndex(
                          ques => ques.question_id === ans.question_id
                        ) as any) > -1
                      );
                    });
                    sessionAnswer.answers = new mongoose.Types.DocumentArray(
                      filteredAnswers.map((ans: any) => {
                        return {
                          exam_question: new ObjectId(ans.question_id),
                          selected_answer: ans.answer,
                        };
                      })
                    );
                    await sessionAnswer.save();
                    examSession.time_left = time_left;
                    examSession.is_ended = true;
                    examSession.end_time = Date.now();
                    clearInterval(interval);
                    await examSession.save();
                    socket.emit('exam-ended', {
                      message: 'exam ended',
                    });
                  });
                  socket.on('disconnect', async () => {
                    examSession.time_left = time_left;
                    await examSession.save();
                  });
                  socket.emit('exam-started', {
                    message: 'exam started',
                    data: {
                      exam_session_id: examSession._id,
                      exam_name: exam.name,
                      duration: exam.duration,
                      questions,
                      answers: [],
                    },
                  });
                  interval = setInterval(async () => {
                    if (time_left > 0) {
                      socket.emit('time-left', {
                        time_left,
                      });
                      time_left--;
                    } else {
                      clearInterval(interval);
                      examSession.time_left = 0;
                      examSession.end_time = Date.now();
                      examSession.is_ended = true;
                      await examSession.save();
                      socket.emit('exam-ended', {
                        message: 'exam ended',
                      });
                    }
                  }, 1000);
                }
              }
            } else {
              inSession = false;
              socket.emit('notify', {
                message: 'Exam not found',
              });
            }
          }
        } catch (e) {
          inSession = false;
          console.log(e);
          socket.emit('notify', {
            message: 'Server error',
          });
        }
      });
    } else {
      socket.emit('notify', {
        message: 'Student not authenticated',
      });
    }
  });
};
