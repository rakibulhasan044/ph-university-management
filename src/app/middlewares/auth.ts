import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUSerRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, 'Unauthorized request');
    }

    //check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(401, 'You are not authorized');
        }

        const role = (decoded as JwtPayload).role

        if(requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(401, 'You are not authorized')
        }
        
        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};

export default auth;
