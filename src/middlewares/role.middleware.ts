import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

// Role-based Authorization Middleware
export const roleAuth = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const userRole = res.locals.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        code: HttpStatus.FORBIDDEN,
        message: 'Access denied. You do not have the required role to access this resource.',
      });
    }
    next();
  };
};
