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
exports.downloadResult = exports.gradeExam = exports.deleteExamQuestion = exports.updateExamQuestion = exports.getSingleExamQuestion = exports.getAllExamQuestions = exports.createExamQuestion = exports.endExam = exports.startExam = exports.updateExam = exports.deleteExam = exports.getExam = exports.getAllExams = exports.createExam = exports.updateStudent = exports.deleteStudent = exports.getAllStudentsByClass = exports.getRecentStudents = exports.getAllStudents = exports.getStudent = exports.createStudent = exports.deleteClass = exports.updateClass = exports.getClass = exports.getAllClasses = exports.createClass = exports.updateSchool = exports.getSchool = exports.login = exports.register = void 0;
const dtos_util_1 = require("../utils/dtos.util");
const school_model_1 = __importDefault(require("../models/school.model"));
const helpers_util_1 = require("../utils/helpers.util");
const jwt_util_1 = require("../utils/jwt.util");
const class_model_1 = __importDefault(require("../models/class.model"));
const mongoose_1 = __importStar(require("mongoose"));
const student_model_1 = __importDefault(require("../models/student.model"));
const exam_model_1 = __importDefault(require("../models/exam.model"));
const exam_question_model_1 = __importDefault(require("../models/exam-question.model"));
const exam_session_answer_model_1 = __importDefault(require("../models/exam-session-answer.model"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const register = async (req, res) => {
    const body = req.body;
    const { name, password, address, email } = body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!name || !password || !address || !email) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    if (!emailRegex.test(email)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Enter a valid email', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findOne({ email });
        if (school) {
            (0, dtos_util_1.sendResponse)(res, null, 'Email already taken', 400, 'error');
            return;
        }
        const hashedPassword = await (0, helpers_util_1.hashPassword)(password);
        await school_model_1.default.create({
            name,
            address,
            password: hashedPassword,
            email,
            logo: `https://ui-avatars.com/api/?name=${name}&color=00b4d8&background=fff&w=96q=100`,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        (0, dtos_util_1.sendResponse)(res, null, 'Registeration successful', 201, 'success');
        return;
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.register = register;
const login = async (req, res) => {
    const body = req.body;
    const { email, password } = body;
    if (!email || !password) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findOne({ email }).select('-__v');
        if (!school) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid credentials', 400, 'error');
            return;
        }
        const hashedPassword = school.password;
        const validated = await (0, helpers_util_1.comparePassword)(password, hashedPassword);
        if (validated) {
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            const total_students = await student_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            const total_exams = await exam_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            const total_classes = await class_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            delete schoolObj.password;
            const token = (0, jwt_util_1.signJWT)(schoolObj, 'school');
            const data = {
                school: {
                    ...schoolObj,
                    analytics: {
                        total_students,
                        total_exams,
                        total_classes,
                    },
                },
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
const getSchool = async (req, res) => {
    const id = req.user.id;
    try {
        const school = await school_model_1.default.findById(id).select('-password -__v');
        if (school) {
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            const total_students = await student_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            const total_exams = await exam_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            const total_classes = await class_model_1.default.countDocuments({
                school_id: schoolObj.id,
            });
            delete schoolObj.password;
            (0, dtos_util_1.sendResponse)(res, {
                ...schoolObj,
                analytics: {
                    total_students,
                    total_exams,
                    total_classes,
                },
            }, 'School fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getSchool = getSchool;
const updateSchool = async (req, res) => {
    const id = req.user.id;
    const { address, name } = req.body;
    if (!address || !name) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findById(id).select('-password -__v');
        if (school) {
            school.address = address;
            school.name = name;
            school.updated_at = Date.now();
            await school.save();
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            delete schoolObj.password;
            (0, dtos_util_1.sendResponse)(res, schoolObj, 'School updated successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.updateSchool = updateSchool;
const createClass = async (req, res) => {
    const { name } = req.body;
    const { id } = req.user;
    if (!name) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const createdClass = await class_model_1.default.create({
            school_id: id,
            name,
        });
        const classObj = (0, helpers_util_1.cleanUp)(createdClass);
        (0, dtos_util_1.sendResponse)(res, classObj, 'Class created successfully', 201, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.createClass = createClass;
const getAllClasses = async (req, res) => {
    const { id } = req.user;
    try {
        const classes = await class_model_1.default.find({ school_id: id }).select('-__v');
        const refinedClasses = classes.map(classV => {
            const classObj = (0, helpers_util_1.cleanUp)(classV);
            return classObj;
        });
        const data = {
            results: refinedClasses,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Classes fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllClasses = getAllClasses;
const getClass = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
        return;
    }
    try {
        const classV = await class_model_1.default.findById(id).select('-__v');
        if (classV) {
            const classObj = (0, helpers_util_1.cleanUp)(classV);
            (0, dtos_util_1.sendResponse)(res, classObj, 'Class fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Class not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getClass = getClass;
const updateClass = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    const { name } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
        return;
    }
    if (!name) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const classV = await class_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (classV) {
            classV.name = name;
            classV.updated_at = Date.now();
            await classV.save();
            const classObj = classV.toObject();
            (0, dtos_util_1.sendResponse)(res, classObj, 'Class updated successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Class not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.updateClass = updateClass;
const deleteClass = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    try {
        const deletedClass = await class_model_1.default.findOneAndDelete({
            _id: new ObjectId(id),
            school_id,
        });
        if (deletedClass) {
            (0, dtos_util_1.sendResponse)(res, { id: deletedClass._id }, 'Class deleted successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Class not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.deleteClass = deleteClass;
const createStudent = async (req, res) => {
    const body = req.body;
    const school_id = req.user.id;
    const { firstname, lastname, middlename, class_id } = body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(class_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
        return;
    }
    if (!firstname || !lastname || !class_id) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const fetchedClass = await class_model_1.default.findOne({
            _id: new ObjectId(class_id),
            school_id,
        });
        if (!fetchedClass) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
            return;
        }
        const password = (0, helpers_util_1.generateAlphanumericPassword)(6);
        const highestStudentAccessId = await student_model_1.default.findOne().sort('-access_id');
        const access_id = highestStudentAccessId
            ? highestStudentAccessId.access_id + 1
            : 1000;
        const student = await student_model_1.default.create({
            firstname,
            lastname,
            middlename: middlename !== null && middlename !== void 0 ? middlename : '',
            class: new ObjectId(class_id),
            school_id,
            image: `https://ui-avatars.com/api/?name=${firstname} ${lastname}&color=00b4d8&background=fff&w=96q=100`,
            password,
            access_id,
        });
        const studentObj = (0, helpers_util_1.cleanUp)(student);
        (0, dtos_util_1.sendResponse)(res, studentObj, 'Student created successfully', 201, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.createStudent = createStudent;
const getStudent = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid student id', 400, 'error');
        return;
    }
    try {
        const student = await student_model_1.default.findById(id)
            .populate({
            path: 'class',
            select: 'name',
        })
            .select('-__v');
        if (student) {
            const studentObj = (0, helpers_util_1.cleanUp)(student);
            (0, dtos_util_1.sendResponse)(res, studentObj, 'Student fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Student not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getStudent = getStudent;
const getAllStudents = async (req, res) => {
    const { id } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const students = await student_model_1.default.find({ school_id: id })
            .populate({
            path: 'class',
            select: 'name',
        })
            .select('-__v')
            .skip(skip)
            .limit(limit);
        const total = await student_model_1.default.countDocuments({ school_id: id });
        const refinedStudents = students.map(student => {
            const studentObj = (0, helpers_util_1.cleanUp)(student);
            return studentObj;
        });
        const data = {
            results: refinedStudents,
            total,
            limit,
            page,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Students fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllStudents = getAllStudents;
const getRecentStudents = async (req, res) => {
    const { id } = req.user;
    try {
        const students = await student_model_1.default.find({ school_id: id })
            .populate({
            path: 'class',
            select: 'name',
        })
            .sort('-created_at')
            .select('-__v')
            .limit(10);
        const refinedStudents = students.map(student => {
            const studentObj = (0, helpers_util_1.cleanUp)(student);
            return studentObj;
        });
        const data = {
            results: refinedStudents,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Recent students fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getRecentStudents = getRecentStudents;
const getAllStudentsByClass = async (req, res) => {
    const { id } = req.user;
    const { id: class_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const students = await student_model_1.default.find({
            school_id: id,
            class: new ObjectId(class_id),
        })
            .populate({
            path: 'class',
            select: 'name',
        })
            .select('-__v')
            .skip(skip)
            .limit(limit);
        const total = await student_model_1.default.countDocuments({
            school_id: id,
            class: new ObjectId(class_id),
        });
        const refinedStudents = students.map(student => {
            const studentObj = (0, helpers_util_1.cleanUp)(student);
            return studentObj;
        });
        const data = {
            results: refinedStudents,
            total,
            limit,
            page,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Students fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllStudentsByClass = getAllStudentsByClass;
const deleteStudent = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid student id', 400, 'error');
        return;
    }
    try {
        const deletedStudent = await student_model_1.default.findOneAndDelete({
            _id: new ObjectId(id),
            school_id,
        });
        if (deletedStudent) {
            (0, dtos_util_1.sendResponse)(res, { id: deletedStudent._id }, 'Student deleted successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Student not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.deleteStudent = deleteStudent;
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    const { firstname, lastname, middlename, class_id } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid student id', 400, 'error');
        return;
    }
    if (!firstname || !lastname || !class_id) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const fetchedClass = await class_model_1.default.findOne({
            _id: new ObjectId(class_id),
            school_id,
        });
        if (!fetchedClass) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
            return;
        }
        const student = await student_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (student) {
            student.firstname = firstname;
            student.lastname = lastname;
            student.middlename = middlename !== null && middlename !== void 0 ? middlename : '';
            student.class = new ObjectId(class_id);
            student.updated_at = Date.now();
            await student.save();
            const studentObj = student.toObject();
            (0, dtos_util_1.sendResponse)(res, studentObj, 'Student updated successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Student not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.updateStudent = updateStudent;
const createExam = async (req, res) => {
    const { name, class_id, duration, to_answer, description } = req.body;
    const { id: school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(class_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
        return;
    }
    if (!name || !duration || !to_answer || !description) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const fetchedClass = await class_model_1.default.findOne({
            _id: new ObjectId(class_id),
            school_id,
        });
        if (!fetchedClass) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
            return;
        }
        if (typeof duration !== 'number') {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid duration type', 400, 'error');
            return;
        }
        if (typeof to_answer !== 'number') {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid to answer type', 400, 'error');
            return;
        }
        const school = await school_model_1.default.findById(school_id);
        if (!(school === null || school === void 0 ? void 0 : school.exam_limit)) {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam limit reached.', 400, 'error');
            return;
        }
        if (school === null || school === void 0 ? void 0 : school.is_disabled) {
            (0, dtos_util_1.sendResponse)(res, null, 'School not verified.', 400, 'error');
            return;
        }
        const createdExam = await exam_model_1.default.create({
            school_id,
            name,
            duration,
            to_answer,
            class_id,
            description,
        });
        const examObj = (0, helpers_util_1.cleanUp)(createdExam);
        school.exam_limit = school.exam_limit - 1;
        await school.save();
        (0, dtos_util_1.sendResponse)(res, examObj, 'Exam created successfully', 201, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.createExam = createExam;
const getAllExams = async (req, res) => {
    const { id } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const exams = await exam_model_1.default.find({ school_id: id })
            .select('-__v')
            .skip(skip)
            .limit(limit);
        const total = await exam_model_1.default.countDocuments({ school_id: id });
        const refinedExams = exams.map(exam => {
            const examObj = (0, helpers_util_1.cleanUp)(exam);
            return examObj;
        });
        const data = {
            results: refinedExams,
            total,
            limit,
            page,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Exams fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllExams = getAllExams;
const getExam = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const exam = await exam_model_1.default.findById(id).select('-__v');
        if (exam) {
            const examObj = (0, helpers_util_1.cleanUp)(exam);
            (0, dtos_util_1.sendResponse)(res, examObj, 'Exam fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getExam = getExam;
const deleteExam = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const deletedExam = await exam_model_1.default.findOneAndDelete({
            _id: new ObjectId(id),
            school_id,
        });
        if (deletedExam) {
            (0, dtos_util_1.sendResponse)(res, { id: deletedExam._id }, 'Exam deleted successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.deleteExam = deleteExam;
const updateExam = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    const { name, class_id, duration, to_answer } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    if (!(0, mongoose_1.isObjectIdOrHexString)(class_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
        return;
    }
    if (!name || !duration || !to_answer) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    try {
        const fetchedClass = await class_model_1.default.findOne({
            _id: new ObjectId(class_id),
            school_id,
        });
        if (!fetchedClass) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid class id', 400, 'error');
            return;
        }
        const exam = await exam_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (exam) {
            exam.name = name;
            exam.duration = duration;
            exam.to_answer = to_answer;
            exam.class_id = class_id;
            exam.updated_at = Date.now();
            await exam.save();
            const examObj = exam.toObject();
            (0, dtos_util_1.sendResponse)(res, examObj, 'Exam updated successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.updateExam = updateExam;
const startExam = async (req, res) => {
    var _a;
    const { id } = req.params;
    const school_id = req.user.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const exam = await exam_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (exam) {
            const examQuesCount = await exam_question_model_1.default.countDocuments({
                exam_id: exam._id,
                school_id,
            });
            if (examQuesCount < ((_a = exam.to_answer) !== null && _a !== void 0 ? _a : 0)) {
                (0, dtos_util_1.sendResponse)(res, null, 'Exam question to answer is greater than the available exam questions.', 400, 'error');
                return;
            }
            if (exam.is_available) {
                (0, dtos_util_1.sendResponse)(res, null, 'Exam started already', 400, 'error');
                return;
            }
            exam.is_available = true;
            exam.updated_at = Date.now();
            await exam.save();
            const examObj = exam.toObject();
            (0, dtos_util_1.sendResponse)(res, examObj, 'Exam started successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.startExam = startExam;
const endExam = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.id;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const exam = await exam_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (exam) {
            if (!exam.is_available) {
                (0, dtos_util_1.sendResponse)(res, null, 'Exam ended already', 400, 'error');
                return;
            }
            exam.is_available = false;
            exam.updated_at = Date.now();
            await exam.save();
            const examObj = exam.toObject();
            (0, dtos_util_1.sendResponse)(res, examObj, 'Exam ended successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.endExam = endExam;
const createExamQuestion = async (req, res) => {
    const { question, exam_id, image: rImage, options, type, answer, } = req.body;
    const { id: school_id } = req.user;
    if (!question || !answer || !type || !exam_id) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    if (!(0, mongoose_1.isObjectIdOrHexString)(exam_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const fetchedExam = await exam_model_1.default.findOne({
            _id: new ObjectId(exam_id),
            school_id,
        });
        if (!fetchedExam) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
            return;
        }
        if (type !== 'german' && type !== 'option') {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid question type', 400, 'error');
            return;
        }
        if (type === 'option' && !Array.isArray(options)) {
            (0, dtos_util_1.sendResponse)(res, null, 'Options must be an array', 400, 'error');
            return;
        }
        if (type === 'option' && !(options.length > 1)) {
            (0, dtos_util_1.sendResponse)(res, null, 'Question must contain atleast two options.', 400, 'error');
            return;
        }
        const createdExamQuestion = await exam_question_model_1.default.create({
            school_id,
            question,
            answer,
            options: type === 'option' ? options : [],
            type,
            exam_id,
            image: rImage !== null && rImage !== void 0 ? rImage : '',
        });
        const examObj = (0, helpers_util_1.cleanUp)(createdExamQuestion);
        (0, dtos_util_1.sendResponse)(res, examObj, 'Exam question created successfully', 201, 'success');
    }
    catch (e) {
        console.log(e);
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.createExamQuestion = createExamQuestion;
const getAllExamQuestions = async (req, res) => {
    const { id } = req.user;
    const { exam_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!(0, mongoose_1.isObjectIdOrHexString)(exam_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    try {
        const fetchedExam = await exam_model_1.default.findOne({
            _id: new ObjectId(exam_id),
            school_id: id,
        });
        if (!fetchedExam) {
            (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
            return;
        }
        const skip = (page - 1) * limit;
        const examQuestions = await exam_question_model_1.default.find({ school_id: id, exam_id })
            .select('-__v')
            .skip(skip)
            .limit(limit);
        const total = await exam_question_model_1.default.countDocuments({
            school_id: id,
            exam_id,
        });
        const refinedExamQuestions = examQuestions.map(examQ => {
            const examQObj = (0, helpers_util_1.cleanUp)(examQ);
            return examQObj;
        });
        const data = {
            results: refinedExamQuestions,
            total,
            limit,
            page,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Exam questions fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllExamQuestions = getAllExamQuestions;
const getSingleExamQuestion = async (req, res) => {
    const { id } = req.params;
    const { id: school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam question id', 400, 'error');
        return;
    }
    try {
        console.log(school_id, id);
        const exam = await exam_question_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (exam) {
            const examObj = (0, helpers_util_1.cleanUp)(exam);
            (0, dtos_util_1.sendResponse)(res, examObj, 'Exam question fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam question not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getSingleExamQuestion = getSingleExamQuestion;
const updateExamQuestion = async (req, res) => {
    const { id } = req.params;
    const { id: school_id } = req.user;
    const { question, image: rImage, options, type, answer } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam question id', 400, 'error');
        return;
    }
    if (!question || !answer || !type) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    if (type !== 'german' && type !== 'option') {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid question type', 400, 'error');
        return;
    }
    if (type === 'option' && !(options.length > 1)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Question must contain atleast two options.', 400, 'error');
        return;
    }
    try {
        const examQuestion = await exam_question_model_1.default.findOne({
            _id: new ObjectId(id),
            school_id,
        }).select('-__v');
        if (examQuestion) {
            examQuestion.question = question;
            examQuestion.image = rImage !== null && rImage !== void 0 ? rImage : '';
            examQuestion.answer = answer;
            examQuestion.options = type === 'option' ? options : [];
            examQuestion.type = type;
            await examQuestion.save();
            const examQuestionObj = (0, helpers_util_1.cleanUp)(examQuestion);
            (0, dtos_util_1.sendResponse)(res, examQuestionObj, 'Exam question updated successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.updateExamQuestion = updateExamQuestion;
const deleteExamQuestion = async (req, res) => {
    const { id } = req.params;
    const { id: school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam question id', 400, 'error');
        return;
    }
    try {
        const deletedExamQuestion = await exam_question_model_1.default.findOneAndDelete({
            _id: new ObjectId(id),
            school_id,
        });
        if (deletedExamQuestion) {
            (0, dtos_util_1.sendResponse)(res, { id: deletedExamQuestion._id }, 'Exam question deleted successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'Exam question not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.deleteExamQuestion = deleteExamQuestion;
const gradeExam = async (req, res) => {
    const { id } = req.params;
    const { id: school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    if (!(0, mongoose_1.isObjectIdOrHexString)(school_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const studentAnswers = await exam_session_answer_model_1.default.find({
            exam_id: id,
            school_id,
            graded: false,
        })
            .populate({
            path: 'student',
            select: 'firstname lastname middlename access_id image',
        })
            .populate({
            path: 'answers.exam_question',
            select: 'answer',
        });
        studentAnswers.forEach(async (studentAnswer) => {
            let score = 0;
            studentAnswer.answers.forEach(answer => {
                if (answer.selected_answer === (answer === null || answer === void 0 ? void 0 : answer.exam_question).answer) {
                    score++;
                }
            });
            studentAnswer.score = score;
            studentAnswer.graded = true;
            await studentAnswer.save();
        });
        (0, dtos_util_1.sendResponse)(res, {}, 'Exam sessions graded', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.gradeExam = gradeExam;
const downloadResult = async (req, res) => {
    const { id } = req.params;
    const { id: school_id } = req.user;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid exam id', 400, 'error');
        return;
    }
    if (!(0, mongoose_1.isObjectIdOrHexString)(school_id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const studentAnswers = await exam_session_answer_model_1.default.find({
            exam_id: id,
            school_id,
            graded: true,
        }).populate({
            path: 'student',
            select: 'firstname lastname middlename access_id image',
        });
        const studentResult = studentAnswers.map(studentAnswer => {
            return {
                student: studentAnswer.student,
                score: studentAnswer.score,
                exam_date: studentAnswer.created_at,
            };
        });
        (0, dtos_util_1.sendResponse)(res, studentResult, 'Student results generated successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.downloadResult = downloadResult;
//# sourceMappingURL=school.controller.js.map