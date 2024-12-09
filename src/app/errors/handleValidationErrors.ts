import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map((val) => {
    if (
      val instanceof mongoose.Error.ValidatorError ||
      val instanceof mongoose.Error.CastError
    ) {
      return {
        path: val?.path,
        message: val?.message,
      };
    }

    // Fallback for unexpected error objects
    return {
      path: 'unknown',
      message: 'An unknown validation error occurred',
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };
};

export default handleValidationError;
