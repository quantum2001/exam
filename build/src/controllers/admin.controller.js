"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchoolExamCount = exports.deleteSchool = exports.enableSchool = exports.disableSchool = exports.getSingleSchool = exports.getAllSchools = exports.login = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const dtos_util_1 = require("../utils/dtos.util");
const school_model_1 = __importDefault(require("../models/school.model"));
const helpers_util_1 = require("../utils/helpers.util");
const mongoose_1 = require("mongoose");
const login = async (req, res) => {
    const body = req.body;
    const { username, password } = body;
    if (!username || !password) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
        return;
    }
    if (username === process.env.SUPER_ADMIN_USERNAME &&
        password === process.env.SUPER_ADMIN_PASSWORD) {
        const token = (0, jwt_util_1.signJWT)(null, 'admin');
        const data = { token };
        (0, dtos_util_1.sendResponse)(res, data, 'Signin successfull', 200, 'success');
    }
    else {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid username or password', 401, 'error');
    }
};
exports.login = login;
const getAllSchools = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const schools = await school_model_1.default.find()
            .select('-password -__v')
            .skip(skip)
            .limit(limit);
        const total = await school_model_1.default.countDocuments();
        const refinedSchools = schools.map(school => {
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            return schoolObj;
        });
        const data = {
            results: refinedSchools,
            total,
            page,
            limit,
        };
        (0, dtos_util_1.sendResponse)(res, data, 'Schools fetched successfully', 200, 'success');
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getAllSchools = getAllSchools;
const getSingleSchool = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findById(id).select('-password -__v');
        if (school) {
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            (0, dtos_util_1.sendResponse)(res, schoolObj, 'School fetched successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.getSingleSchool = getSingleSchool;
const disableSchool = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findById(id).select('-password -__v');
        if (school) {
            school.is_disabled = true;
            school.updated_at = Date.now();
            await school.save();
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            (0, dtos_util_1.sendResponse)(res, schoolObj, 'School disabled successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.disableSchool = disableSchool;
const enableSchool = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const school = await school_model_1.default.findById(id).select('-password -__v');
        if (school) {
            school.is_disabled = false;
            school.updated_at = Date.now();
            await school.save();
            const schoolObj = (0, helpers_util_1.cleanUp)(school);
            (0, dtos_util_1.sendResponse)(res, schoolObj, 'School enabled successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.enableSchool = enableSchool;
const deleteSchool = async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    try {
        const deletedSchool = await school_model_1.default.findByIdAndDelete(id);
        if (deletedSchool) {
            (0, dtos_util_1.sendResponse)(res, { id: deletedSchool._id }, 'School deleted successfully', 200, 'success');
        }
        else {
            (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
        }
    }
    catch (e) {
        (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
    }
};
exports.deleteSchool = deleteSchool;
const updateSchoolExamCount = async (req, res) => {
    const { id } = req.params;
    const { exam_limit } = req.body;
    if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid school id', 400, 'error');
        return;
    }
    if (typeof exam_limit === 'number') {
        try {
            const school = await school_model_1.default.findById(id).select('-password -__v');
            if (school) {
                school.exam_limit = exam_limit;
                school.updated_at = Date.now();
                await school.save();
                const schoolObj = (0, helpers_util_1.cleanUp)(school);
                (0, dtos_util_1.sendResponse)(res, schoolObj, 'School exam limit updated successfully', 200, 'success');
            }
            else {
                (0, dtos_util_1.sendResponse)(res, null, 'School not found', 404, 'error');
            }
        }
        catch (e) {
            (0, dtos_util_1.sendResponse)(res, null, 'Server error', 500, 'error');
        }
    }
    else {
        (0, dtos_util_1.sendResponse)(res, null, 'Invalid request body or missing field.', 400, 'error');
    }
};
exports.updateSchoolExamCount = updateSchoolExamCount;
//# sourceMappingURL=admin.controller.js.map