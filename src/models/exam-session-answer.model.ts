import mongoose, {Schema, model} from 'mongoose';

const answerSchema = new Schema({
  exam_question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamQuestion'
  },
  selected_answer: {
    type: String,
  },
});

const examSessionAnswerSchema = new Schema({
  exam_session_id: {
    type: String,
    required: [true, 'exam session id required'],
  },
  school_id: {
    type: String,
    required: [true, 'school id required'],
  },
  exam_id: {
    type: String,
    required: [true, 'exam id required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
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
    default: Date.now(),
    required: true,
  },
});

const Model = model('ExamSessionAnswer', examSessionAnswerSchema);

export default Model;
