import {Request, Response} from 'express';
import {ILoginAdmin} from '../dtos/admin.dto';
import {signJWT} from '../utils/jwt.util';
import {sendResponse} from '../utils/dtos.util';
import logger from '../utils/logger.util';
import SchoolModel from '../models/school.model';
import {cleanUp} from '../utils/helpers.util';
import {isObjectIdOrHexString} from 'mongoose';

export const login = async (req: Request, res: Response) => {
  const body: ILoginAdmin = req.body;
  const {username, password} = body;
  if (!username || !password) {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
    return;
  }
  if (
    username === process.env.SUPER_ADMIN_USERNAME &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = signJWT(null, 'admin');
    const data = {token};
    sendResponse(res, data, 'Signin successfull', 200, 'success');
  } else {
    sendResponse(res, null, 'Invalid username or password', 401, 'error');
  }
};
export const getAllSchools = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const skip = (page - 1) * limit;
    const schools = await SchoolModel.find()
      .select('-password -__v')
      .skip(skip)
      .limit(limit);
    const total = await SchoolModel.countDocuments();
    const refinedSchools: any = schools.map(school => {
      const schoolObj: any = cleanUp(school);
      return schoolObj;
    });
    const data = {
      results: refinedSchools,
      total,
      page,
      limit,
    };
    sendResponse(res, data, 'Schools fetched successfully', 200, 'success');
  } catch (e: any) {
    logger.error(e?.message);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const getSingleSchool = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid school id', 400, 'error');
    return;
  }
  try {
    const school = await SchoolModel.findById(id).select('-password -__v');
    if (school) {
      const schoolObj: any = cleanUp(school);
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
  } catch (e: any) {
    logger.error(e?.message);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const disableSchool = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid school id', 400, 'error');
    return;
  }
  try {
    const school = await SchoolModel.findById(id).select('-password -__v');
    if (school) {
      school.is_disabled = true;
      school.updated_at = Date.now();
      await school.save();
      const schoolObj: any = cleanUp(school);
      sendResponse(
        res,
        schoolObj,
        'School disabled successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'School not found', 404, 'error');
    }
  } catch (e: any) {
    logger.error(e?.message);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const enableSchool = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid school id', 400, 'error');
    return;
  }
  try {
    const school = await SchoolModel.findById(id).select('-password -__v');
    if (school) {
      school.is_disabled = false;
      school.updated_at = Date.now();
      await school.save();
      const schoolObj: any = cleanUp(school);
      sendResponse(
        res,
        schoolObj,
        'School enabled successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'School not found', 404, 'error');
    }
  } catch (e: any) {
    logger.error(e?.message);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const deleteSchool = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid school id', 400, 'error');
    return;
  }
  try {
    const deletedSchool = await SchoolModel.findByIdAndDelete(id);
    if (deletedSchool) {
      sendResponse(
        res,
        {id: deletedSchool._id},
        'School deleted successfully',
        200,
        'success'
      );
    } else {
      sendResponse(res, null, 'School not found', 404, 'error');
    }
  } catch (e: any) {
    logger.error(e?.message);
    sendResponse(res, null, 'Server error', 500, 'error');
  }
};
export const updateSchoolExamCount = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {exam_limit} = req.body;
  if (!isObjectIdOrHexString(id)) {
    sendResponse(res, null, 'Invalid school id', 400, 'error');
    return;
  }
  if (typeof exam_limit === 'number') {
    try {
      const school = await SchoolModel.findById(id).select('-password -__v');
      if (school) {
        school.exam_limit = exam_limit;
        school.updated_at = Date.now();
        await school.save();
        const schoolObj: any = cleanUp(school);
        sendResponse(
          res,
          schoolObj,
          'School exam limit updated successfully',
          200,
          'success'
        );
      } else {
        sendResponse(res, null, 'School not found', 404, 'error');
      }
    } catch (e) {
      sendResponse(res, null, 'Server error', 500, 'error');
    }
  } else {
    sendResponse(
      res,
      null,
      'Invalid request body or missing field.',
      400,
      'error'
    );
  }
};
