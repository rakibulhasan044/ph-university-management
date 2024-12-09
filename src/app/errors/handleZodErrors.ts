import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (zodErr: ZodError): TGenericErrorResponse => {
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

export default handleZodError;
