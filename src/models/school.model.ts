import {Schema, model} from 'mongoose';

const schoolSchema = new Schema({
  name: {
    type: String,
    required: [true, 'school name required'],
  },
  address: {
    type: String,
    required: [true, 'address required'],
  },
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
  },
  logo: {
    type: String,
    requred: true,
  },
  exam_limit: {
    type: Number,
    default: 1,
  },
  is_disabled: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Number,
    default: Date.now(),
    required: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
  },
  updated_at: {
    type: Number,
    required: true,
    default: Date.now(),
  },
});

const Model = model('School', schoolSchema);

export default Model;
