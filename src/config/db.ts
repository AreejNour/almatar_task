import mongoose from "mongoose";
import winston from "winston";
import config from "../config";

const { db } = config;

// Build the connection string
const dbURI = `mongodb+srv://${db.user}:${db.password}@clusterty.znzyz.mongodb.net/${db.name}?retryWrites=true&w=majority`;

// const dbURI = `mongodb://127.0.0.1:27017/${db.name}`;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

winston.debug(dbURI);

// Create the database connection
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("connect");
  })
  .catch((e) => {});
