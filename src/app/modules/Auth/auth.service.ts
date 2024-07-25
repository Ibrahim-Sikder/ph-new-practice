/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {

  const user = await User.isUserExistsByCustomId(payload?.id)
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found! ')
  }
  const isDeleted = user?.isDeleted
  if(isDeleted){
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted ! ')
  }
  const userStatus = user?.status
  if(userStatus === 'blocked'){
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked! ')
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const JwtPayload = {
    userId:user?.id,
    role:user?.role
  }

  // const accessToken =  jwt.sign(JwtPayload, config.jwt_access_secret as string , { expiresIn: config.jwt_access_expires_in });
  

  const accessToken = createToken(JwtPayload, config.jwt_access_secret as string,config.jwt_access_expires_in as string )

  const refreshToken = createToken(JwtPayload, config.jwt_refresh_secret as string,config.jwt_refresh_expires_in as string )


return {
  accessToken, 
  refreshToken,
  needPasswordChange: user?.needsPasswordChange,
}



};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData.userId);


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );


const result = await User.findOneAndUpdate(
  {
    id:userData.userId,
    role:userData.role
  },
  {
    password:newHashedPassword,
    needsPasswordChange:false,
    passwordChangedAt:new Date()
  }
)

// return result;
return {}
 
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  if (
    user.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized!');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};


const forgetPassword = async (userId: string) => {
 




};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  




};

export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken
};
