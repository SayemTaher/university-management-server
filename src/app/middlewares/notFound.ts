

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  // Return 404 (Not Found) status with a standardized error response
  // This ensures all undefined routes return a consistent error format
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    error: '',
  });
};

export default notFoundRoute;
