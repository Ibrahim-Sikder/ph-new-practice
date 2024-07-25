/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchAbleFields } from './student.constant';


const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  // const queryObj = { ...query }

  // let searchTerm = '';

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string
  // }


  // const searchQuery = Student.find({
  //   $or: ['email', 'name.firstName', 'pressentAddress'].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' }
  //   }))
  // })

  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page','fields'];
  // excludeFields.forEach((el) => delete queryObj[el])


  // const filterQuery = searchQuery.find(queryObj).populate('user')
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: { path: 'academicFaculty' },
  //   });

  // let sort = '-createdAt';
  // if (query.sort) {
  //   sort = query.sort as string
  // }

  // const sortQuery = filterQuery.sort(sort)

  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = query.limit as number
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery =  paginateQuery.limit(limit)

  // let fields = '-__v';
  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ')
  // }

  // const fiedsQuery = await limitQuery.select(fields)
  // return fiedsQuery;

  const studentQuery = new QueryBuilder(
    Student.find().populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      }),
    query,
  )
    .search(studentSearchAbleFields)
    ?.filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery?.modelQuery;
  return result;

};



const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.aggregate([{ $match: { id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')
    }

    const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction()
    await session.endSession()
    return deletedUser;
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    console.log(err)
    throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to delete student')
  }

};

const updaeStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, localGuardian, guardian, ...remainingStudentData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });

  return result;
};
export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updaeStudentIntoDB
};