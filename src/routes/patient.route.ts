import express, { IRouter } from 'express';
import { PatientValidator } from '../validators/patient.validator';
import {PatientController} from '../controllers/patient.controller';

class UserRoutes {
  private patientController = new PatientController();
  private router = express.Router();
  private patientValidator = new PatientValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

    //register and book appointment 
    this.router.post('/create', this.patientValidator.validatePatient, this.patientController.createPatient);


  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
