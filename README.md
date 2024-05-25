# Project Name

![Team Photo](Insert a Team Photo URL here)
[_how?_](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

TODO: short project description, some sample screenshots or mockups

## Architecture

TODO: descriptions of code organization and tools and libraries used

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

## Authors

Aimen Abdulaziz, Caleb Ash, Sajjad Kareem, Tayeb Mohammedi

## Acknowledgments
