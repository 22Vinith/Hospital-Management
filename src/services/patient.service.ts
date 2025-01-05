// services/patientService.ts
import patient from '../models/patient.model';

class PatientService {
  public createPatient = async (body: any): Promise<any> => {
    try {
      // Check if a patient with the given email already exists
      const existingPatient = await patient.findOne({ email: body.email });
      if (existingPatient) {
        throw new Error('Patient with this email already exists.');
      }

      // Create the new patient
      const newPatient = await patient.create(body);

      return newPatient;
    } catch (error) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  };
}

export default new PatientService();
