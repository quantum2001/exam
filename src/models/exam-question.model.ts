import {Schema, model} from 'mongoose';

const examQuestionSchema = new Schema({
  exam_id: {
    required: [true, 'exam id required'],
    type: String,
  },
  question: {
    required: [true, 'exam question required'],
    type: String,
  },
  image: String,
  type: {
    type: String,
    required: [true, 'question type required'],
    enum: ['german', 'option'],
  },
  answer: {
    required: [true, 'answer required'],
    type: String,
  },
  options: {
    type: [String],
  },
  created_at: {
    type: Number,
    default: Date.now(),
  },
  updated_at: {
    type: Number,
    required: true,
  },
});

const Model = model('ExamQuestion', examQuestionSchema);

export default Model;
