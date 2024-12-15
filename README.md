/_ eslint-disable @typescript-eslint/no-unused-expressions _/
/_ eslint-disable no-unused-expressions _/
/_ eslint-disable @typescript-eslint/no-unused-vars _/
/_ eslint-disable no-unused-vars _/
/_ eslint-disable @typescript-eslint/no-explicit-any _/

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (
err,
req,
res,
next,
) => {
let statusCode = err.statusCode || 500;
let message = err.message || 'Something went wrong';

let errorSources: TErrorSources = [{
path: '',
message: 'Something went wrong !!'
}]

const handleZodError = (err: ZodError) => {

    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue.message
      }
    })
    const statusCode = 400;

    return {
      statusCode,
      message: 'Validation error',
      errorSources
    }

}

if(err instanceof ZodError) {

    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode,
    message = simplifiedError?.message,
    errorSources = simplifiedError?.errorSources

}

return res.status(statusCode).json({
success: false,
message,
errorSources,
stack: config.node_env == 'development' ? err?.stack : null,
// error: err,
});
};

export default globalErrorHandler;






