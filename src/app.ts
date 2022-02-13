import express from "express";
import "./config/db";
import routes from "./routes";
require("dotenv").config();
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

const app = express();
const createError = require("http-errors");

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
const port = 4000;

app.get("/", (req, res) => {
  res.send("hello!");
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
app.use("/", routes);

app.use(function (req, res, next) {
  next(createError(404));
});
