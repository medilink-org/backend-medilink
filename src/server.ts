import express from "express"
import bodyParser from "body-parser"
import logger from "morgan"
import cors from "cors"
import PractitionerRouter from "./routes/practitioner.route"
import AppointmentRouter from "./routes/appointment.route"
import PatientRouter from "./routes/patient.route"

// basis of our api server
class Server {
  public name: string
  public version: string

  public server: express.Application
  public port: number

  constructor(init: {
    name: string
    version: string
    port: number
    settings: any
    middleware: any
    routes: any
  }) {
    this.name = init.name
    this.version = init.version
    this.server = express()
    this.port = init.port

    this.configure(init.settings, init.middleware, init.routes)
  }

  private configure(settings, middleware, routes) {
    this.server.get("/", async (req, res) => res.sendStatus(200)) // health check endpoint
    settings.forEach((setting) => this.server.set(setting.setting, setting.val))
    middleware.forEach((middleware) => this.server.use(middleware))
    routes.forEach((route) => this.server.use(route.path, route.router))
    this.server.use("/", (req, res) =>
      res.status(200).json(`${this.name} - version: ${this.version}`)
    )
  }

  public listen() {
    this.server.listen(this.port, () =>
      console.log("Running %s | Listening on port: %s", this.name, this.port)
    )
  }
}

//cors options
const options: cors.CorsOptions = {
  // allow all origins for ease of development and demo access. Insecure, but this isn't real data anyway
  origin: "*",
}

// our API server
const server = (name: string, version: string, port: number) => {
  return new Server({
    name: name,
    version: version,
    port: port,
    settings: [{ setting: "trust proxy", val: true }],
    middleware: [
      logger("dev"),
      bodyParser.urlencoded({ extended: false }),
      bodyParser.json(),
      cors(options),
    ],
    routes: [
      new PatientRouter(),
      new PractitionerRouter(),
      new AppointmentRouter(),
    ],
  })
}

export default server
