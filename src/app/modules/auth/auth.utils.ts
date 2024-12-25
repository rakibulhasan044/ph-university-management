import jwt from 'jsonwebtoken';

export const createToken = (
  jetPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jetPayload, secret, {
    expiresIn,
  });
};
