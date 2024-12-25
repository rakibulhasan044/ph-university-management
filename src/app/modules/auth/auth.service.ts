import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  //check if the user exist
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
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

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(403, 'Password not matched ! Try again !!');
  }

  //create token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);
  if (!user) {
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

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(403, 'Password not matched ! Try again !!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  //check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(404, 'User not found!!');
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

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(401, 'You are not authorized');
  }

  //create token and send to the client
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

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
