import { Schema, model } from "mongoose";

const examSessionSchema = new Schema({
    exam_id: {
        type: String,
        required: [true, "exam id required"],
    },
    start_time: {
        type: Number,
        default: Date.now(),
        required: true
    },
    time_left: Number,
    student_id: {
        type: String,
        required: [true, "student id required"]
    },
    end_time: Number
})

const Model = model("ExamSession", examSessionSchema);

export default Model;
