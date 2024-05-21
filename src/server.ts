import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import PractitionerRouter from './routes/practitioner.route';
import AppointmentRouter from './routes/appointment.route';
import PatientRouter from './routes/patient.route';

// Basic API server setup
class Server {
  public name: string;
  public version: string;
  public server: express.Application;
  public port: number;
  private routes = [
    new PatientRouter(),
    new PractitionerRouter(),
    new AppointmentRouter()
  ];

  constructor(init: { name: string; version: string; port: number }) {
    this.name = init.name;
    this.version = init.version;
    this.server = express();
    this.port = init.port;

    this.configure();
  }

  private configure() {
    // Default route
    this.server.get('/', (req, res) =>
      res.status(200).json({ status: 'Connected!' })
    );

    // Middleware
    this.server.use(logger('dev'));
    this.server.use(cors({ origin: '*' }));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));

    // Routes
    this.routes.forEach((route) => this.server.use(route.path, route.router));

    // Catch-all route
    this.server.use('*', (req, res) =>
      res.status(404).json({ error: 'Not Found' })
    );
  }

  public listen() {
    this.server.listen(this.port, () =>
      console.log(`Listening on: http://localhost:${this.port}`)
    );
  }
}

export default Server;
