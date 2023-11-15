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
              class_id: data.data.class_id,
            });
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
                const sessionQuestions = await ESQuestionModel.findOne({
                  exam_session_id: examSession.id,
                });
                socket.on('submit', async () => {
                  examSession.time_left = time_left;
                  examSession.is_ended = true;
                  examSession.end_time = Date.now();
                  clearInterval(interval);
                  await examSession.save();
                  socket.emit('exam-ended', {
                    message: 'exam ended',
                  });
                });
                socket.emit('exam-started', {
                  message: 'exam started',
                  data: {
                    session_id: examSession.id,
                    exam_name: exam.name,
                    duration: exam.duration,
                    questions: sessionQuestions?.questions,
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

                  const esAnswer = await ESAnswerModel.create({
                    exam_session_id: examSession.id,
                    exam_id: examSession.exam_id,
                    school_id: data.data.school_id,
                    student: new ObjectId(data.data.id),
                    answers: [],
                  });
                  console.log(esAnswer);
                  socket.on('submit', async () => {
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
                      exam_session_id: examSession.id,
                      exam_name: exam.name,
                      duration: exam.duration,
                      questions,
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
