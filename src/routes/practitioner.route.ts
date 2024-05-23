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

    // //temp route to assign practitioner to appointments
    // //commented out to avoid a deployed API fiasco, code remains because it's useful
    // this.router.get("/assignAppointments/:id", async (req, res) => {
    //   const practitioner = await Practitioner.model.findById(req.params.id)
    //   if (!practitioner) {
    //     return res.status(404).json({ message: "Practitioner not found" })
    //   }

    //   const appointments = await Appointment.model.find({}) // all
    //   const patients = await Patient.model.find({}) // all

    //   if (!patients) {
    //     return res.status(404).json({ message: "Patients not found" })
    //   }
    //   if (!appointments) {
    //     return res.status(404).json({ message: "Appointments not found" })
    //   }
    //   // patients.forEach(async (patient) => {
    //   //   practitioner.patients.push(patient._id)
    //   // })

    //   appointments.forEach(async (appointment, index) => {
    //     if (index % 2 !== 0) {
    //       // every other appointment, change to === 0 for other half
    //       appointment.practitioner = practitioner._id
    //       practitioner.appointments.push(appointment._id)
    //       await appointment.save()
    //     }
    //   })
    //   await practitioner.save()

    //   return res.status(200).json(practitioner)
    // })

    // login route for demo docs
    // obviously not secure, but this is a demo
    this.router.get('/login/:username/:password', async (req, res) => {
      console.log('login attempt: ', req.params.username, req.params.password);
      const practitioner = await Practitioner.model.findOne({
        username: req.params.username
      });
      if (!practitioner) {
        return res.status(404).send('Practitioner not found');
      }

      if (practitioner.password !== req.params.password) {
        return res.status(401).send('Incorrect password');
      }

      return res.status(200).json(practitioner);
    });

    // create new practitioner
    this.router.post('/', async (req, res) => {
      const practitioner = await new Practitioner.model(req.body).save();
      if (!practitioner) {
        return res.status(500).send('Failed to create practitioner');
      }
      return res.status(201).json(practitioner);
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
  }
}
