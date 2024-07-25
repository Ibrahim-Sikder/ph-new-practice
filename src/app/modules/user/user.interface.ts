import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser  {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangeAt?: Date;
};



export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id:string):Promise<TUser>
  isPasswordMatched(plaingTextPassword:string, hashedPassword:string):Promise<boolean>
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
  
}

export type TUserRole = keyof typeof USER_ROLE;
