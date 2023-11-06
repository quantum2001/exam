import {Schema, model} from 'mongoose';

const studentSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'student firstname required'],
  },
  lastname: {
    type: String,
    required: [true, 'student lastname required'],
  },
  middlename: String,
  class_id: {
    type: String,
    required: [true, 'class id required'],
  },
  access_id: {
    type: Number,
    unique: true,
    required: true,
  },
  school_id: {
    type: String,
    required: [true, 'school id required'],
  },
  image: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
  },
  created_at: {
    type: Number,
    default: Date.now(),
    required: true,
  },
  updated_at: {
    type: Number,
    default: Date.now(),
    required: true,
  },
});

const Model = model('Student', studentSchema);
export default Model;
