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
    this.router.get('/all', (req, res) => {
      Appointment.model
        .find({})
        .populate('patient')
        .populate('practitioner')
        .then((docs) => {
          return res.status(200).json(docs);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // get appointment by date
    this.router.get('/date/:date', (req, res) => {
      const date = new Date(req.params.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      Appointment.model
        .find({
          date: {
            $gte: date,
            $lt: nextDay
          }
        })
        .then((appointments) => res.json(appointments))
        .catch((err) => res.status(500).json('Error: ' + err));
    });

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

    this.router.post(
      '/toPatient/:_id/toPractitioner/:pracId',
      async (req, res) => {
        try {
          const practitioner = await Practitioner.model.findById(
            req.params.pracId
          );
          if (!practitioner) {
            return res
              .status(500)
              .send('Could not find practitioner, appointment creation failed');
          }

          const patient = await Patient.model.findById(req.params._id);
          if (!patient) {
            return res
              .status(500)
              .send('Could not find patient, appointment creation failed');
          }

          let appointment = new Appointment.model(req.body);
          appointment.patient = patient._id;
          appointment.practitioner = practitioner._id;
          appointment = await appointment.save();

          patient.appointments.push(appointment._id);
          await patient.save();

          practitioner.appointments.push(appointment._id);
          await practitioner.save();

          const populatedAppointment = await Appointment.model
            .findById(appointment._id)
            .populate('patient')
            .populate('practitioner');

          console.log(
            'Appointment created and populated:',
            populatedAppointment
          );
          return res.status(200).json(populatedAppointment);
        } catch (error) {
          console.error('Error creating appointment:', error);
          return res
            .status(500)
            .send('Error creating appointment: ' + error.message);
        }
      }
    );

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

    // Other routes...

    this.router.delete('/:_id', async (req, res) => {
      try {
        const appointment = await Appointment.model.findById(req.params._id);
        if (!appointment) {
          return res.status(404).send('Error: could not find appointment');
        }

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

        const patIdx = patient.appointments.indexOf(appointment._id);
        patient.appointments.splice(patIdx, 1);
        await patient.save();

        const pracIdx = practitioner.appointments.indexOf(appointment._id);
        practitioner.appointments.splice(pracIdx, 1);
        await practitioner.save();

        await Appointment.model.deleteOne({ _id: appointment._id });

        return res.status(200).send('Appointment deleted');
      } catch (error) {
        return res
          .status(500)
          .send('Error deleting appointment: ' + error.message);
      }
    });
  }
}
