"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const examSessionSchema = new mongoose_1.Schema({
    exam_id: {
        type: String,
        required: [true, 'exam id required'],
    },
    school_id: {
        type: String,
        required: [true, 'school id required'],
    },
    start_time: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    time_left: Number,
    student_id: {
        type: String,
        required: [true, 'student id required'],
    },
    is_ended: {
        type: Boolean,
        default: false,
    },
    end_time: Number,
});
const Model = (0, mongoose_1.model)('ExamSession', examSessionSchema);
exports.default = Model;
//# sourceMappingURL=exam-session.model.js.map