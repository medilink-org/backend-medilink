# MediLink

Backend for [MediLink](https://github.com/dartmouth-cs52-24s/project-client-medilink).

## Architecture

This repo is near-totally written in Typescript and run through NodeJS. Thus, to run a local copy, you will need a current version of [Node](https://nodejs.org/en) and [NPM](https://www.npmjs.com/).

Our backend is built using MongoDB as a database, as we found that its ease of nesting JSON fields and its flexibility in schema design made it a good fit for our project. We are using the [mongoose](https://mongoosejs.com/) library to interact with the database.

We then use ExpressJS to create a RESTful API to interact with the database from the application. Instructions on how to connect to our deployed API and database are below, as well as instructions on how to run a local version of the database and/or API.

## Setup

- Install dependencies

  ```sh
  npm install
  ```

  The `postinstall` script will automatically build the project after installing dependencies.

- Start Development Mode (for hot-reloading):
  ```sh
  npm run dev
  ```

Since we have `postinstall` script in place, running `npm install` will automatically build the project, so you don't need to manually run `npm run build`. After installing dependencies, enter development mode with `npm run dev`.

Remember to copy `.env.example` to `.env` and fill in the actual values.

If you are working locally, I (Aimen) recommend setting up your env file as such:

```env
PORT=3001
MONGO_DB=mongodb://localhost:27017/medilink_db
BUILD_ENV=dev
```

### Setting Up the Database

To restore a backup of the database, follow these steps:

- Ensure MongoDB is installed and running on your local machine.
- Remove all existing data from the database (optional, but I strongly recommend starting from scratch to avoid conflicts):
  - Connect to your MongoDB instance:
    ```sh
    mongosh "mongodb://localhost:27017/medilink_db"
    ```
  - Drop all collections in the `medilink_db` database:
    ```js
    use medilink_db
    db.getCollectionNames().forEach(function(c) {
        db[c].drop();
    });
    ```
- Finally, restore the backup to your local MongoDB instance. If you are working in the root directory, you may use the following command. Otherwise, change the `--dir` value to the path of your mongodb dump directory.
  ```sh
  mongorestore --uri="mongodb://localhost:27017/medilink_db" --dir=src/backup_data/mongodump/production
  ```

After making any changes locally and testing them, you may deploy the project to Render or any other hosting service, which will take care of setting the correct environment variables.

### Additional Commands

- **Lint the Code**:

  ```sh
  npm run lint
  ```

- **Fix Linting Issues**:

  ```sh
  npm run lint:fix
  ```

- **Format the Code**:
  ```sh
  npm run format
  ```

## Deployment

To deploy the the Project (Production Mode), begin by installing the dependencies using `npm install`. As mentioned above, `postinstall` will take care of building the project. Thus, after running `npm install`, you should start the application using the compiled code in the build directory using `npm start`.

A deployed version of the frontend lives at [medilink-backend](https://medi-link-api.onrender.com/)

## Routes

Our API exposes the following routes to all users. If we were going to production these would be authenticated and have various permissions tied to them, especially powerful routes such as `DELETE`, but for this demo we have skipped them.

Be sure to set the `Content-Type` header to `application/json` for all requests.

- **Patient**

  - GET `/patient/id/:_id` - returns patient with given id
  - GET `/patient/name/:name` - returns patient with a given name. Currently not enforcing unique names in the database so returns the first, but for testing purposes we are using unique names.
  - GET `/patient/all` - returns all patients in the database.
  - POST `/patient` - creates a new patient. Expects a patient in request body
  - PUT `/patient/:_id` - updates patient with given id. Expects an update object in request body
  - DELETE `/patient/:_id` - deletes patient with given id

- **Practitioner**

  - GET `/practitioner/id/:_id` - returns practitioner with given id
  - GET `/practitioner/user/:username` - returns practitioner with a given username (must be unique)
  - POST `/practitioner` - creates a new practitioner. Expects a practitioner in request body.
  - PUT `/practitioner/:_id` - updates practitioner with given id. Expects an update object in request body.
  - PUT `/practitioner/id/:_id/addPatient/:patientId` - validates existence of both the given patient and practitioner, then adds the given patient to the practitioner's list of patients
  - PUT `/practitioner/id/:_id/addAppointment/:appointmentId` - validates the existence of both the given pracitioner and appointment. If they both exist, updates the practitioner with the appointment info and adds the practitioner to the appointment.
  - DELETE `/practitioner/:id` - deletes practitioner with given id. Also removed them from all appointments they are attached to.

- **Appointment**
  - GET `/appointment/id/:_id` - returns appointment with given id
  - POST `/appointment` - creates a new appointment without tying it to any practitioner or patient. Expects an appointment in request body.
  - POST `/appointment/toPatient/:_id/toPractitioner/:pracId` - creates a new appointment and ties it to the given patient and practitioner (referenced by their mongoose objectID). Expects an appointment in request body
  - POST `/appointment/toPatient/:_id/toPractitioner/:pracId/multiple` - similar to the above route but in this cases expects an array of appointments in request body
  - POST `/appointment/toPatient/:_id/multiple` - similar to the above route but does nothing to assign a practitioner. In this cases expects an array of appointments in request body
  - PUT `/appointment/:_id` - updates appointment with given id. Expects an update object in request body.
  - DELETE `/appointment/:id` - deletes appointment with given id and removes from its respective patient and practitioner


## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Authors

Aimen Abdulaziz, Sajjad Kareem, Caleb Ash, Tayeb Mohammedi

## Acknowledgments

EasyEMR project
