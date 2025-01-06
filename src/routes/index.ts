import express, { IRouter } from 'express';
const router = express.Router();

import patientRoute from './patient.route';
import doctorRoute from './doctor.route'

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/patient', new patientRoute().getRoutes());
  router.use('/doctor', new doctorRoute().getRoutes());
  return router;
};

export default routes;
