import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  //check if the user exist

  const user = await User.isUserExistsByCustomId(payload?.id)
  if (! user) {
    throw new AppError(404, 'User not found');
  }

  //check if the user is deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(403, 'This user is deleted');
  }

  //check if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked');
  }

  if(! await User.isPasswordMatched(payload?.password, user?.password)) {
    throw new AppError(403, 'Password not matched ! Try again !!');
  }

  //create token and send to the client
  const jwtPayload = {
    userId: user.id,
    role:  user.role
  }

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: '10d' });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange
  };
};

export const AuthServices = {
  loginUser,
};
