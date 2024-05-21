declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      PORT: string
      MONGO_DB: string
      // add more environment variables and their types here
    }
  }
}
