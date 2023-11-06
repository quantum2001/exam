import {Request, Response} from 'express';
import {
  ICreateStudentReq,
  ILoginSchoolReq,
  IRegisterSchoolReq,
} from '../dtos/school.dto';
import {sendResponse} from '../utils/dtos.util';
import SchoolModel from '../models/school.model';
import {
  cleanUp,
  comparePassword,
  generateAlphanumericPassword,
  hashPassword,
} from '../utils/helpers.util';
import {signJWT} from '../utils/jwt.util';
import ClassModel from '../models/class.model';
import mongoose, {isObjectIdOrHexString} from 'mongoose';
import StudentModel from '../models/student.model';
const ObjectId = mongoose.Types.ObjectId;
interface AuthenticatedReq extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  const body: IRegisterSchoolReq = req.body;
  const {name, password, address, email} = body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!name || !password || !address || !email) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  if (!emailRegex.test(email)) {
    sendResponse(res, null, 'Enter a valid email', 400, 'error');
    return;
  }
  try {
    const school = await SchoolModel.findOne({email});
    if (school) {
      sendResponse(res, null, 'Email already taken', 400, 'error');
      return;
    }
    const hashedPassword = await hashPassword(password);
    await SchoolModel.create({
      name,
      address,
      password: hashedPassword,
      email,
      logo: `https://ui-avatars.com/api/?name=${name}&color=000&background=fff&w=96q=100`,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    sendResponse(res, null, 'Registeration successful', 201, 'success');
    return;
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const login = async (req: Request, res: Response) => {
  const body: ILoginSchoolReq = req.body;
  const {email, password} = body;
  if (!email || !password) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const school = await SchoolModel.findOne({email}).select('-__v');
    if (!school) {
      sendResponse(res, null, 'Invalid credentials', 400, 'error');
      return;
    }
    const hashedPassword = school.password;
    const validated = await comparePassword(password, hashedPassword);
    if (validated) {
      const schoolObj: any = cleanUp(school);
      delete schoolObj.password;
      const token = signJWT(schoolObj, 'school');
      const data = {
        school: schoolObj,
        token,
      };
      sendResponse(res, data, 'Signin successfull', 200, 'success');
    } else {
      sendResponse(res, null, 'Invalid credentials', 400, 'error');
      return;
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getSchool = async (req: AuthenticatedReq, res: Response) => {
  const id = req.user.id;
  try {
    const school = await SchoolModel.findById(id).select('-password -__v');
    if (school) {
      const schoolObj: any = cleanUp(school);
      delete schoolObj.password;
      sendResponse(
        res,
        schoolObj,
        'School fetched successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'School not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const updateSchool = async (req: AuthenticatedReq, res: Response) => {
  const id = req.user.id;
  const {address, name} = req.body;
  if (!address || !name) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const school = await SchoolModel.findById(id).select('-password -__v');
    if (school) {
      school.address = address;
      school.name = name;
      school.updated_at = Date.now();
      await school.save();
      const schoolObj: any = cleanUp(school);
      delete schoolObj.password;
      sendResponse(
        res,
        schoolObj,
        'School updated successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'School not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const createClass = async (req: AuthenticatedReq, res: Response) => {
  const {name} = req.body;
  const {id} = req.user;
  if (!name) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const createdClass = await ClassModel.create({
      school_id: id,
      name,
    });
    const classObj: any = cleanUp(createdClass);
    sendResponse(res, classObj, 'Class created successfully', 201, 'success');
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getAllClasses = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.user;
  try {
    const classes = await ClassModel.find({school_id: id}).select('-__v');
    const refinedClasses = classes.map(classV => {
      const classObj: any = cleanUp(classV);
      return classObj;
    });
    const data = {
      results: refinedClasses,
    };
    sendResponse(res, data, 'Classes fetched successfully', 200, 'success');
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const deleteClass = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.params;
  const school_id = req.user.id;
  try {
    const deletedClass = await ClassModel.findOneAndDelete({
      _id: new ObjectId(id),
      school_id,
    });
    if (deletedClass) {
      sendResponse(
        res,
        {id: deletedClass._id},
        'Class deleted successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'Class not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const createStudent = async (req: AuthenticatedReq, res: Response) => {
  const body: ICreateStudentReq = req.body;
  const school_id = req.user.id;
  const {firstname, lastname, middlename, class_id} = body;
  if (!isObjectIdOrHexString(class_id)) {
    sendResponse(res, null, 'Invalid class id', 400, 'error');
    return;
  }
  if (!firstname || !lastname || !class_id) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const fetchedClass = await ClassModel.findOne({
      _id: new ObjectId(class_id),
      school_id,
    });
    if (!fetchedClass) {
      sendResponse(res, null, 'Invalid class id', 400, 'error');
      return;
    }
    const password = generateAlphanumericPassword(6);
    const highestStudentAccessId =
      await StudentModel.findOne().sort('-access_id');
    const access_id = highestStudentAccessId
      ? highestStudentAccessId.access_id + 1
      : 1000;
    const student = await StudentModel.create({
      firstname,
      lastname,
      middlename: middlename ?? '',
      class_id,
      school_id,
      password,
      access_id,
    });
    const studentObj = cleanUp(student);
    sendResponse(
      res,
      studentObj,
      'Student created successfully',
      201,
      'success'
    );
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getStudent = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.params;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid student id', 400, 'error');
    return;
  }
  try {
    const student = await StudentModel.findById(id).select('-__v');
    if (student) {
      const studentObj: any = cleanUp(student);
      sendResponse(
        res,
        studentObj,
        'Student fetched successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'Student not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getAllStudents = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const skip = (page - 1) * limit;
    const students = await StudentModel.find({school_id: id})
      .select('-__v')
      .skip(skip)
      .limit(limit);
    const total = await StudentModel.countDocuments();
    const refinedStudents = students.map(student => {
      const studentObj: any = cleanUp(student);
      return studentObj;
    });
    const data = {
      results: refinedStudents,
      total,
      limit,
      page,
    };
    sendResponse(res, data, 'Students fetched successfully', 200, 'success');
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const deleteStudent = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.params;
  const school_id = req.user.id;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid student id', 400, 'error');
    return;
  }
  try {
    const deletedStudent = await StudentModel.findOneAndDelete({
      _id: new ObjectId(id),
      school_id,
    });
    if (deletedStudent) {
      sendResponse(
        res,
        {id: deletedStudent._id},
        'Student deleted successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'Student not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const updateStudent = async (req: AuthenticatedReq, res: Response) => {
  const {id} = req.params;
  const school_id = req.user.id;
  const {firstname, lastname, middlename, class_id} = req.body;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid student id', 400, 'error');
    return;
  }
  if (!firstname || !lastname || !class_id) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  try {
    const fetchedClass = await ClassModel.findOne({
      _id: new ObjectId(class_id),
      school_id,
    });
    if (!fetchedClass) {
      sendResponse(res, null, 'Invalid class id', 400, 'error');
      return;
    }
    const student = await StudentModel.findOne({
      _id: new ObjectId(id),
      school_id,
    }).select('-__v');
    if (student) {
      student.firstname = firstname;
      student.lastname = lastname;
      student.middlename = middlename ?? '';
      student.class_id = class_id;
      student.updated_at = Date.now();
      await student.save();
      const studentObj: any = student.toObject();
      sendResponse(
        res,
        studentObj,
        'Student updated successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'Student not found', 404, 'error');
    }
  } catch (e) {
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const createExam = async (req: AuthenticatedReq, res: Response) => {};
export const getAllExam = async (req: AuthenticatedReq, res: Response) => {};
export const getExam = async (req: AuthenticatedReq, res: Response) => {};
export const deleteExam = async (req: AuthenticatedReq, res: Response) => {};
export const downloadResult = async (
  req: AuthenticatedReq,
  res: Response
) => {};
export const updateExam = async (req: AuthenticatedReq, res: Response) => {};
export const startExam = async (req: AuthenticatedReq, res: Response) => {};
export const endExam = async (req: AuthenticatedReq, res: Response) => {};
export const createExamQuestion = async (
  req: AuthenticatedReq,
  res: Response
) => {};
export const getAllExamQuestions = async (
  req: AuthenticatedReq,
  res: Response
) => {};
export const getSingleExamQuestion = async (
  req: AuthenticatedReq,
  res: Response
) => {};
export const updateExamQuestion = async (
  req: AuthenticatedReq,
  res: Response
) => {};
export const deleteExamQuestion = async (
  req: AuthenticatedReq,
  res: Response
) => {};
