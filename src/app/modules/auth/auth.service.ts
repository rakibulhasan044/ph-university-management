import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  //check if the user exist
  const isUserExists = await User.findOne({ id: payload?.id });
  console.log(isUserExists);

  if (!isUserExists) {
    throw new AppError(404, 'User not found');
  }

  //check if the user is deleted
  const isDeleted = isUserExists?.isDeleted;

  if (isDeleted) {
    throw new AppError(403, 'This user is deleted');
  }

  //check if the user is blocked
  const userStatus = isUserExists?.status;

  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked');
  }
  return {};
};

export const AuthServices = {
  loginUser,
};
