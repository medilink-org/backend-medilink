import express from 'express';
import Appointment from '../models/appointment.model';
import Patient from '../models/patient.model';
import Practitioner from '../models/practitioner.model';

export default class AppointmentRouter {
  public path = '/appointment';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
    console.log('Appointment router initialized...');
  }

  private initializeRoutes() {
    //get all appointments
    this.router.get('/all', (req, res) => {
      Appointment.model
        .find({})
        .then((docs) => {
          return res.status(200).json(docs);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // get by appointment ID
    this.router.get('/id/:_id', (req, res) => {
      Appointment.model
        .findById(req.params._id)
        .populate('patient')
        .populate('practitioner')
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // create new appointment
    this.router.post('/', (req, res) => {
      new Appointment.model(req.body)
        .save()
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // create new appointment and tie to patient with given id
    this.router.post(
      '/toPatient/:_id/toPractitioner/:pracId',
      async (req, res) => {
        // get specified practitioner
        const practitioner = await Practitioner.model.findById(
          req.params.pracId
        );
        if (!practitioner) {
          return res
            .status(500)
            .send('Could not find practitioner, appointment creation failed');
        }
        // get specified patient
        const patient = await Patient.model.findById(req.params._id);
        if (!patient) {
          return res
            .status(500)
            .send('Could not find patient, appointment creation failed');
        }
        // create appointment
        const appointment = new Appointment.model(req.body);
        await appointment.save();
        if (!appointment) {
          return res.status(500).send('Error, could not create appointment');
        }

        // update patient
        appointment.patient = patient._id;
        patient.appointments.push(appointment._id);
        patient.save();

        // update practitioner
        appointment.practitioner = practitioner._id;
        practitioner.appointments.push(appointment._id);
        practitioner.save();
        await appointment.save();

        return res.status(200).json(appointment);
      }
    );

    // create multiple appointments and tie to patient and practitioner with given id
    this.router.post(
      '/toPatient/:_id/toPractitioner/:pracId/multiple',
      async (req, res) => {
        // get and check practitioner
        const practitioner = await Practitioner.model.findById(
          req.params.pracId
        );
        if (!practitioner) {
          return res
            .status(500)
            .send('Error finding practitioner, appointments not created');
        }
        // get and check patient
        const patient = await Patient.model.findById(req.params._id);
        if (!patient) {
          return res
            .status(500)
            .send('Error finding patient, appointments not created');
        }

        for (const appointment of req.body.appointments) {
          const newAppointment = new Appointment.model(appointment);
          newAppointment.patient = patient._id;
          newAppointment.practitioner = practitioner._id;
          newAppointment.save();
          patient.appointments.push(newAppointment._id);
          practitioner.appointments.push(newAppointment._id);
        }
        await patient.save();
        await practitioner.save();

        return res.status(200).json(patient.appointments);
      }
    );

    // create multiple appointments and tie to patient with given id
    this.router.post('/toPatient/:_id/multiple', async (req, res) => {
      // get and check patient
      const patient = await Patient.model.findById(req.params._id);
      if (!patient) {
        return res
          .status(500)
          .send('Error finding patient, appointments not created');
      }

      for (const appointment of req.body.appointments) {
        const newAppointment = new Appointment.model(appointment);
        newAppointment.patient = patient._id;
        newAppointment.save();
        patient.appointments.push(newAppointment._id);
      }
      await patient.save();

      return res.status(200).json(patient.appointments);
    });

    // update existing appointment by id
    this.router.put('/:_id', async (req, res) => {
      const appointment = await Appointment.model.findByIdAndUpdate(
        req.params._id,
        req.body,
        { upsert: true }
      );
      if (!appointment) {
        return res.status(404).send('Error: could not find appointment');
      }
      return res.status(200).json(req.body);
    });

    // delete appointment
    this.router.delete('/:_id', async (req, res) => {
      const appointment = await Appointment.model.findById(req.params._id);
      if (!appointment)
        return res.status(404).send('Error: could not find appointment');

      // find attached patient and practitioner
      const patient = await Patient.model.findById(appointment.patient);
      if (!patient) {
        return res
          .status(404)
          .send('Error: could not find patient for this appointment');
      }
      const practitioner = await Practitioner.model.findById(
        appointment.practitioner
      );
      if (!practitioner) {
        return res
          .status(404)
          .send('Error: could not find practitioner for this appointment');
      }

      // remove from attached patient
      const patIdx = patient.appointments.indexOf(appointment._id);
      patient.appointments.splice(patIdx, 1);
      patient.save();
      // remove from attached practitioner
      const pracIdx = practitioner.appointments.indexOf(appointment._id);
      practitioner.appointments.splice(pracIdx, 1);
      practitioner.save();
      // delete appointment from DB
      Appointment.model
        .deleteOne({ _id: appointment._id })
        .then(() => {
          return res.status(200).send('Appointment deleted');
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });
  }
}
