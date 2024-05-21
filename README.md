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

To deploy the the Project (Production Mode), begin by installing the dependencies using `npm install` and start the application using the compiled code in the build directory using `npm start`.

## Authors

Aimen Abdulaziz, Caleb Ash, Sajjad Kareem, Tayeb Mohammedi

## Acknowledgments
