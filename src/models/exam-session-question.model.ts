import { Schema, model } from "mongoose";

const questionSchema = new Schema({
    exam_question_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["german", "option"]
    },
    options: [String],
    created_at: {
        type: Number,
        required: true,
        default: Date.now(),
    },
})

const examSessionQuestionSchema = new Schema({
    exam_session_id: String,
    questions: [questionSchema],
    created_at: {
        type: Number,
        default: Date.now(),
    },
})
const Model = model("ExamSessionQuestion", examSessionQuestionSchema);

export default Model;
