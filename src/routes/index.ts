import express, { IRouter } from 'express';
const router = express.Router();

import patientRoute from './patient.route';

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

  return router;
};

export default routes;
