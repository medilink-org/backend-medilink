import express from 'express';
import Practitioner from '../models/practitioner.model';
import Appointment from '../models/appointment.model';
// import Patient from "../models/patient.model"

export default class PractitionerRouter {
  public path = '/practitioner';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
    console.log('Practitioner router initialized...');
  }

  private initializeRoutes() {
    // get all practitioners
    this.router.get('/all', (req, res) => {
      Practitioner.model
        .find({})
        .then((docs) => {
          return res.status(200).json(docs);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });
    // get by ID
    this.router.get('/id/:_id', async (req, res) => {
      const practitioner = await Practitioner.model
        .findOne({ _id: req.params._id })
        .populate('patients')
        .populate('appointments');
      if (!practitioner) {
        return res.status(404).json({ message: 'Practitioner not found' });
      }
      return res.status(200).json(practitioner);
    });

    // get by username
    this.router.get('/user/:username', async (req, res) => {
      const practitioner = await Practitioner.model
        .findOne({ username: req.params.username })
        .populate({
          path: 'patients',
          populate: {
            path: 'appointments'
          }
        })
        .populate('appointments');
      if (!practitioner) {
        return res.status(404).json({ message: 'Practitioner not found' });
      }
      return res.status(200).json(practitioner);
    });

    // update practitioner
    this.router.put('/id/:_id', async (req, res) => {
      const practitioner = await Practitioner.model.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true, upsert: true }
      );
      if (!practitioner) {
        return res
          .status(500)
          .json({ message: 'Failed to update practitioner' });
      }
      return res.status(200).json(practitioner);
    });

    // add patient
    this.router.put('/id/:_id/addPatient/:patientId', async (req, res) => {
      const practitioner = await Practitioner.model.findById(req.params._id);
      const patient = await Practitioner.model.findById(req.params.patientId);
      if (practitioner && patient) {
        practitioner.patients.push(patient._id);
        practitioner.save();
      }
      if (!practitioner || !patient) {
        return res
          .status(500)
          .json({ message: 'Failed to add patient to practitioner' });
      }
      return res.status(200).json(practitioner);
    });

    // add appointment
    this.router.put(
      '/id/:_id/addAppointment/:appointmentId',
      async (req, res) => {
        const practitioner = await Practitioner.model.findById(req.params._id);
        const appointment = await Practitioner.model.findById(
          req.params.appointmentId
        );
        if (practitioner && appointment) {
          practitioner.appointments.push(appointment._id);
          practitioner.save();
        }
        if (!practitioner || !appointment) {
          return res
            .status(500)
            .json({ message: 'Failed to add appointment to practitioner' });
        }
        return res.status(200).json(practitioner);
      }
    );

    // delete practitioner
    this.router.delete('/id/:_id', async (req, res) => {
      const practitioner = await Practitioner.model.findById(req.params._id);
      if (!practitioner) {
        return res.status(404).send('Practitioner not found');
      }
      // remove from appointments
      const appointments = await Appointment.model.find({
        _id: practitioner._id
      });
      appointments.forEach((appointment) => {
        appointment.practitioner = null;
        appointment.save();
      });

      // delete practitioner
      practitioner.deleteOne();

      return res.status(200).send('Practitioner deleted');
    });

    // get practitioner availability
    this.router.get('/available', async (req, res) => {
      try {
        const practitioners = await Practitioner.model.find({
          'availability.0': { $exists: true }
        });
        return res.status(200).json(practitioners);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    this.router.get('/availability/:id', async (req, res) => {
      const practitioner = await Practitioner.model.findById(req.params.id);
      if (!practitioner) {
        return res.status(404).json({ message: 'Practitioner not found' });
      }
      return res.status(200).json(practitioner.availability);
    });

    // update practitioner availability
    this.router.put('/availability/:id', async (req, res) => {
      const { availability } = req.body;
      const practitioner = await Practitioner.model.findByIdAndUpdate(
        req.params.id,
        { availability },
        { new: true }
      );
      if (!practitioner) {
        return res
          .status(500)
          .json({ message: 'Failed to update availability' });
      }
      return res.status(200).json(practitioner.availability);
    });

    this.router.delete('/availability/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const practitioner = await Practitioner.model.findById(id);

        if (!practitioner) {
          return res.status(404).json({ message: 'Practitioner not found' });
        }

        practitioner.availability = [];
        await practitioner.save();

        res.status(200).json({ message: 'Availability deleted' });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
    });
  }
}
