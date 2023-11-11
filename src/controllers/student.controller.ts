import {Request, Response} from 'express';
import {sendResponse} from '../utils/dtos.util';
import SchoolModel from '../models/school.model';
import StudentModel from '../models/student.model';
import {cleanUp} from '../utils/helpers.util';
import {signJWT} from '../utils/jwt.util';
import ExamQuestionModel from '../models/exam-question.model';
import ExamSessionModel from '../models/exam-session.model';
import mongoose, {isObjectIdOrHexString} from 'mongoose';
import logger from '../utils/logger.util';
import ESAnswerModel from '../models/exam-session-answer.model';
import ESQuestionModel from '../models/exam-session-question.model';
const ObjectId = mongoose.Types.ObjectId;
interface AuthenticatedReq extends Request {
  user?: any;
}
export const login = async (req: Request, res: Response) => {
  const body = req.body;
  const {access_id, password, school_id} = body;
  if (!access_id || !password || !school_id) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const school = await SchoolModel.findById(school_id).select('-__v');
    if (!school) {
      sendResponse(res, null, 'Invalid school id', 400, 'error');
      return;
    }
    const student = await StudentModel.findOne({
      access_id,
      password,
      school_id,
    });
    if (student) {
      const studentObj: any = cleanUp(student);
      delete studentObj.password;
      const token = signJWT(studentObj, 'student');
      const data = {
        student: studentObj,
        token,
      };
      sendResponse(res, data, 'Signin successfull', 200, 'success');
    } else {
      sendResponse(res, null, 'Invalid credentials', 400, 'error');
      return;
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const submitAnswer = async (req: AuthenticatedReq, res: Response) => {
  const {session_id} = req.params;
  const {question_id, answer} = req.body;
  const {school_id} = req.user;
  if (!isObjectIdOrHexString(session_id)) {
    sendResponse(res, null, 'Invalid session id', 400, 'error');
    return;
  }
  if (!isObjectIdOrHexString(question_id)) {
    sendResponse(res, null, 'Invalid question id', 400, 'error');
    return;
  }
  if (!question_id || !answer) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const examSession = await ExamSessionModel.findOne({
      _id: new ObjectId(session_id),
      school_id,
    });
    if (!examSession) {
      sendResponse(res, null, 'Invalid session id', 400, 'error');
      return;
    }
    const examQuestion = await ExamQuestionModel.findOne({
      _id: new ObjectId(question_id),
      school_id,
    });
    if (!examQuestion) {
      sendResponse(res, null, 'Invalid question id', 400, 'error');
      return;
    }
    if (examSession.is_ended) {
      sendResponse(res, null, 'Exam session has ended', 400, 'error');
      return;
    }
    const esAnswer = await ESAnswerModel.findOne({exam_session_id: session_id});
    const esQuestion = await ESQuestionModel.findOne({
      exam_session_id: session_id,
    });

    if (esAnswer && esQuestion) {
      const answers = esAnswer.answers.map(ans => ans.toObject());
      const questions = esQuestion.questions.map(q => q.toObject());
      const answerIdx = answers.findIndex(
        (ans: any) => ans.exam_question._id === question_id
      );
      const questionIdx = questions.findIndex(
        (q: any) => q.question_id === question_id
      );
      if (questionIdx === -1) {
        sendResponse(
          res,
          null,
          'Question not assigned to student',
          400,
          'error'
        );
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
      esAnswer.answers = new mongoose.Types.DocumentArray(answers);
      await esAnswer.save();
      sendResponse(res, {question_id}, 'Answer recorded', 200, 'success');
    } else {
      sendResponse(res, null, 'Exam session answer not found', 400, 'error');
      return;
    }
  } catch (e) {
    logger.error(JSON.stringify(e));
    console.log(e);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const schools = await SchoolModel.find({is_disabled: false}).select(
      '-password -__v'
    );
    const total = await SchoolModel.countDocuments({is_disabled: false});
    const refinedSchools: any = schools.map(school => {
      const schoolObj: any = cleanUp(school);
      return schoolObj;
    });
    const data = {
      results: refinedSchools,
      total,
    };
    sendResponse(res, data, 'Schools fetched successfully', 200, 'success');
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
