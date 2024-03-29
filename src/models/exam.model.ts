import {Schema, model} from 'mongoose';

const examSchema = new Schema({
  name: {
    type: String,
    required: [true, 'exam name required'],
  },
  school_id: {
    type: String,
    required: [true, 'school id required'],
  },
  to_answer: {
    type: Number,
    required: true,
  },
  is_available: {
    type: Boolean,
    required: true,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: [true, 'duration required'],
  },
  created_at: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  updated_at: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  class_ids: {
    type: [String],
    required: true,
  },
});

const Model = model('Exam', examSchema);

export default Model;
