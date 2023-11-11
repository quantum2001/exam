"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examSocketController = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const exam_session_model_1 = __importDefault(require("../models/exam-session.model"));
const exam_model_1 = __importDefault(require("../models/exam.model"));
const mongoose_1 = __importStar(require("mongoose"));
const exam_question_model_1 = __importDefault(require("../models/exam-question.model"));
const exam_session_question_model_1 = __importDefault(require("../models/exam-session-question.model"));
const exam_session_answer_model_1 = __importDefault(require("../models/exam-session-answer.model"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const examSocketController = (io) => {
    const examNamespace = io.of(/^\/exam\/[a-zA-Z0-9_]+$/);
    examNamespace.on('connection', async (socket) => {
        var _a;
        let time_left = 0;
        let interval;
        let inSession = false;
        const student_id = socket.nsp.name.split('/')[2];
        const token = (_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const data = (0, jwt_util_1.verifyJWT)(token);
        if (data &&
            data.iss === 'krendus-exam-server' &&
            data.type === 'student' &&
            student_id === data.data.id) {
            socket.emit('connected', {
                message: 'Student connected to exam server',
            });
            socket.on('start-exam', async ({ exam_id }) => {
                var _a, _b, _c;
                if (inSession)
                    return;
                try {
                    inSession = true;
                    if (!(0, mongoose_1.isObjectIdOrHexString)(exam_id)) {
                        socket.emit('notify', {
                            message: 'Invalid exam id',
                        });
                    }
                    else {
                        const exam = await exam_model_1.default.findOne({
                            _id: new ObjectId(exam_id),
                            school_id: data.data.school_id,
                            class_id: data.data.class_id,
                        });
                        if (!(exam === null || exam === void 0 ? void 0 : exam.is_available)) {
                            inSession = false;
                            socket.emit('notify', {
                                message: 'Exam not available',
                            });
                            return;
                        }
                        if (exam) {
                            const examSession = await exam_session_model_1.default.findOne({
                                school_id: data.data.school_id,
                                exam_id,
                                student_id,
                            });
                            if (examSession) {
                                time_left = (_a = examSession.time_left) !== null && _a !== void 0 ? _a : 0;
                                const sessionQuestions = await exam_session_question_model_1.default.findOne({
                                    exam_session_id: examSession.id,
                                });
                                socket.on('submit', async () => {
                                    examSession.time_left = time_left;
                                    examSession.is_ended = true;
                                    examSession.end_time = Date.now();
                                    clearInterval(interval);
                                    await examSession.save();
                                    socket.emit('exam-ended', {
                                        message: 'exam ended',
                                    });
                                });
                                socket.emit('exam-started', {
                                    message: 'exam started',
                                    data: {
                                        session_id: examSession.id,
                                        questions: sessionQuestions === null || sessionQuestions === void 0 ? void 0 : sessionQuestions.questions,
                                    },
                                });
                                socket.on('disconnect', async () => {
                                    examSession.time_left = time_left;
                                    await examSession.save();
                                });
                                interval = setInterval(async () => {
                                    if (time_left > 0) {
                                        socket.emit('time-left', {
                                            time_left,
                                        });
                                        time_left--;
                                    }
                                    else {
                                        clearInterval(interval);
                                        examSession.time_left = 0;
                                        examSession.end_time = Date.now();
                                        examSession.is_ended = true;
                                        await examSession.save();
                                        socket.emit('exam-ended', {
                                            message: 'exam ended',
                                        });
                                    }
                                }, 1000);
                            }
                            else {
                                const examSession = await exam_session_model_1.default.create({
                                    exam_id,
                                    time_left: exam.duration * 60,
                                    start_time: Date.now(),
                                    student_id: data.data.id,
                                    school_id: data.data.school_id,
                                    is_ended: false,
                                });
                                if (examSession) {
                                    time_left = (_b = examSession.time_left) !== null && _b !== void 0 ? _b : 0;
                                    let questions = await exam_question_model_1.default.aggregate([
                                        { $match: { exam_id } },
                                        { $sample: { size: (_c = exam.to_answer) !== null && _c !== void 0 ? _c : 1 } },
                                    ]);
                                    questions = questions.map(question => {
                                        return {
                                            question_id: question._id,
                                            options: question.options,
                                            question: question.question,
                                            type: question.type,
                                        };
                                    });
                                    await exam_session_question_model_1.default.create({
                                        exam_session_id: examSession.id,
                                        questions,
                                    });
                                    const esAnswer = await exam_session_answer_model_1.default.create({
                                        exam_session_id: examSession.id,
                                        exam_id: examSession.exam_id,
                                        school_id: data.data.school_id,
                                        student: new ObjectId(data.data.id),
                                        answers: [],
                                    });
                                    console.log(esAnswer);
                                    socket.on('submit', async () => {
                                        examSession.time_left = time_left;
                                        examSession.is_ended = true;
                                        examSession.end_time = Date.now();
                                        clearInterval(interval);
                                        await examSession.save();
                                        socket.emit('exam-ended', {
                                            message: 'exam ended',
                                        });
                                    });
                                    socket.on('disconnect', async () => {
                                        examSession.time_left = time_left;
                                        await examSession.save();
                                    });
                                    socket.emit('exam-started', {
                                        message: 'exam started',
                                        data: {
                                            exam_session_id: examSession.id,
                                            questions,
                                        },
                                    });
                                    interval = setInterval(async () => {
                                        if (time_left > 0) {
                                            socket.emit('time-left', {
                                                time_left,
                                            });
                                            time_left--;
                                        }
                                        else {
                                            clearInterval(interval);
                                            examSession.time_left = 0;
                                            examSession.end_time = Date.now();
                                            examSession.is_ended = true;
                                            await examSession.save();
                                            socket.emit('exam-ended', {
                                                message: 'exam ended',
                                            });
                                        }
                                    }, 1000);
                                }
                            }
                        }
                        else {
                            inSession = false;
                            socket.emit('notify', {
                                message: 'Exam not found',
                            });
                        }
                    }
                }
                catch (e) {
                    inSession = false;
                    console.log(e);
                    socket.emit('notify', {
                        message: 'Server error',
                    });
                }
            });
        }
        else {
            socket.emit('notify', {
                message: 'Student not authenticated',
            });
        }
    });
};
exports.examSocketController = examSocketController;
//# sourceMappingURL=socket.controller.js.map