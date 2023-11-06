import {Schema, model} from 'mongoose';

const answerSchema = new Schema({
  exam_question_id: {
    type: String,
    required: true,
  },
  selected_answer: {
    type: String,
    required: true,
  },
});
const miniStudentSchema = new Schema({
  class: String,
  firstname: String,
  lastname: String,
  middlename: String,
  access_id: Number,
});

const examSessionAnswerSchema = new Schema({
  exam_session_id: {
    type: String,
    required: [true, 'exam session id required'],
  },
  student_id: {
    type: String,
    required: [true, 'student id required'],
  },
  school_id: {
    type: String,
    required: [true, 'school id required'],
  },
  exam_id: {
    type: String,
    required: [true, 'exam id required'],
  },
  student: miniStudentSchema,
  score: Number,
  graded: {
    type: Boolean,
    default: false,
  },
  answers: [answerSchema],
  created_at: {
    type: Number,
    default: Date.now(),
  },
  updated_at: {
    type: Number,
    required: true,
  },
});

const Model = model('ExamSessionAnswer', examSessionAnswerSchema);

export default Model;
