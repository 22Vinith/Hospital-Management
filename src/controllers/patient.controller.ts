import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import PatientService from '../services/patient.service';

export class PatientController {
  public createPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await PatientService.createPatient(req.body);

      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Booked appointment successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `Error booking patients appointment: ${error.message}`,
      });
    }
  };
}

