import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong !!',
    },
  ];

  const handleZodError = (zodErr: ZodError) => {
    const errorSources: TErrorSources = zodErr.issues.map((issue: ZodIssue) => ({
      path: issue?.path[issue.path.length - 1] as string,
      message: issue.message,
    }));
    const statusCode = 400;

    return {
      statusCode,
      message: 'Validation error',
      errorSources,
    };
  };

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : null,
  });

  // Explicitly calling `next` to satisfy the `ErrorRequestHandler` type.
  next();
};

export default globalErrorHandler;
