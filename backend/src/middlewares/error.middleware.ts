import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Request Error',
    message
  });
};
