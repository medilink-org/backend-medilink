import express from 'express';
import Patient from '../models/patient.model';
// import Practitioner from "../models/practitioner.model"

export default class PatientRouter {
  public path = '/patient';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
    console.log('Patient router initialized...');
  }

  private initializeRoutes() {
    // get all patients
    this.router.get('/all', (req, res) => {
      Patient.model
        .find({})
        .then((docs) => {
          return res.status(200).json(docs);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // get by patient ID
    this.router.get('/id/:_id', (req, res) =>
      Patient.model
        .findById(req.params._id)
        .populate('appointments')
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        })
    );

    // get by name- requires unique names which is currently enforced when we post data
    this.router.get('/name/:name', (req, res) => {
      Patient.model
        .findOne({ name: new RegExp(`^${req.params.name}$`, 'i') }) //case insensitive due to render normalizing url
        .populate('appointments')
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // create new patient
    this.router.post('/', (req, res) => {
      new Patient.model(req.body)
        .save()
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // update existing patient
    this.router.put('/:_id', (req, res) => {
      Patient.model
        .findByIdAndUpdate(req.params._id, req.body, { upsert: true })
        .then((doc) => {
          return res.status(200).json(doc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });

    // Note- does not delete attached appointments since those also have significance to practitioners
    this.router.delete('/:_id', (req, res) => {
      Patient.model
        .deleteOne({ _id: req.params._id })
        // executes after query completes
        .then((val) => {
          return res.status(200).json(val);
        })
        // for now simply log error
        .catch((err) => {
          return res.status(500).json(err);
        });
    });
  }
}
