import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

import { StudentServices } from './student.service';
import { sendResponse } from '../../../utils/sendResponse';
import { catchAsync } from '../../../utils/catchAsync';

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {


  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrieved succesfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllStudents = async ( req: Request,res: Response, next: NextFunction,) => {

  
  try {
    const result = await StudentServices.getAllStudentsFromDB(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student are retrieved succesfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is deleted succesfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const updateStudent: RequestHandler = catchAsync(async (req, res, next) => {

  const { studentId } = req.params;
  const {student} = req.body
  const result = await StudentServices.updaeStudentIntoDB(studentId, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' student update successfully!',
    data: result,
  });
  next()

});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};