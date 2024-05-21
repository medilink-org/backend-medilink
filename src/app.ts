import mongoose from "mongoose"
import server from "./server"
import pjson from "../package.json"
import dotenv from "dotenv"

dotenv.config()

const port = Number(process.env.PORT) || 3001
let mongo = process.env.MONGO_DB ? process.env.MONGO_DB : undefined
if (process.env.BUILD_ENV === "production") {
  mongo = process.env.MONGO_PROD
} else if (process.env.BUILD_ENV === "test") {
  mongo = process.env.MONGO_TEST
}
const NAME = pjson.name
const VERSION = pjson.version

console.log("Starting: %s | Version: %s", pjson.name, pjson.version)

mongoose.connect(mongo!).catch((err) => {
  throw new Error("Failed to connect to MongoDB: " + err)
})

const connection = mongoose.connection

connection.on("error", (err) => {
  throw new Error("Connection with MongoDB lost: " + err)
})

connection.on("open", () => {
  console.log("MongoDB connection open")
  server(NAME, VERSION, port).listen()
})

process.on("SIGINT", () => {
  connection.close().then(() => {
    console.log("\nMongoDB connection closed")
    process.exit(0)
  })
})
