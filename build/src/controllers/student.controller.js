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
exports.getAllSchools = exports.submitAnswer = exports.login = void 0;
const dtos_util_1 = require("../utils/dtos.util");
const school_model_1 = __importDefault(require("../models/school.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const helpers_util_1 = require("../utils/helpers.util");
const jwt_util_1 = require("../utils/jwt.util");
const exam_question_model_1 = __importDefault(require("../models/exam-question.model"));
const exam_session_model_1 = __importDefault(require("../models/exam-session.model"));
const mongoose_1 = __importStar(require("mongoose"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const exam_session_answer_model_1 = __importDefault(require("../models/exam-session-answer.model"));
const exam_session_question_model_1 = __importDefault(require("../models/exam-session-question.model"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const login = async (req, res) => {
    const body = req.body;
    const { access_id, password, school_id } = body;
    if (!access_id || !password || !school_id) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findById(school_id).select('-__v');
        if (!school) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
            return;
        }
        const student = await student_model_1.default.findOne({
            access_id,
            password,
            school_id,
        });
        if (student) {
            const studentObj = (0, helpers_util_1.cleanUp)(student);
            delete studentObj.password;
            const token = (0, jwt_util_1.signJWT)(studentObj, 'student');
            const data = {
                student: studentObj,
                token,
            };
            (0, dtos_util_1.sendResponse)(res, data, 'Signin successfull', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid credentials', 400, 'error');
            return;
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.login = login;
const submitAnswer = async (req, res) => {
    const { session_id } = req.params;
    const { question_id, answer } = req.body;
    const { school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(session_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid session id', 400, 'error');
        return;
    }
    if (!(0, mongoose_1.isObjectIdOrHexString)(question_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid question id', 400, 'error');
        return;
    }
    if (!question_id || !answer) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const examSession = await exam_session_model_1.default.findOne({
            _id: new ObjectId(session_id),
            school_id,
        });
        if (!examSession) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid session id', 400, 'error');
            return;
        }
        const examQuestion = await exam_question_model_1.default.findOne({
            _id: new ObjectId(question_id),
            school_id,
        });
        if (!examQuestion) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid question id', 400, 'error');
            return;
        }
        if (examSession.is_ended) {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam session has ended', 400, 'error');
            return;
        }
        const esAnswer = await exam_session_answer_model_1.default.findOne({ exam_session_id: session_id });
        const esQuestion = await exam_session_question_model_1.default.findOne({
            exam_session_id: session_id,
        });
        if (esAnswer && esQuestion) {
            const answers = esAnswer.answers.map(ans => ans.toObject());
            const questions = esQuestion.questions.map(q => q.toObject());
            const answerIdx = answers.findIndex((ans) => ans.exam_question._id === question_id);
            const questionIdx = questions.findIndex((q) => q.question_id === question_id);
            if (questionIdx === -1) {
                (0, dtos_util_1.sendResponse)(res, null, 'Question not assigned to student', 400, 'error');
                return;
            }
            if (answerIdx > -1) {
                answers[answerIdx] = {
                    ...answers[answerIdx],
                    selected_answer: answer,
                };
            }
            else {
                answers.push({
                    exam_question: new ObjectId(question_id),
                    selected_answer: answer,
                });
            }
            esAnswer.answers = new mongoose_1.default.Types.DocumentArray(answers);
            await esAnswer.save();
            (0, dtos_util_1.sendResponse)(res, { question_id }, 'Answer recorded', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam session answer not found', 400, 'error');
            return;
        }
    }
    catch (e) {
        logger_util_1.default.error(JSON.stringify(e));
        console.log(e);
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.submitAnswer = submitAnswer;
const getAllSchools = async (req, res) => {
    try {
        const schools = await school_model_1.default.find({ is_disabled: false }).select('-password -__v');
        const total = await school_model_1.default.countDocuments({ is_disabled: false });
        const refinedSchools = schools.map(school => {
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            return schoolObj;
        });
        const data = {
            results: refinedSchools,
            total,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Schools fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllSchools = getAllSchools;
//# sourceMappingURL=student.controller.js.map