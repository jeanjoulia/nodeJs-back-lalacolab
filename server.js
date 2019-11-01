import initializeApp from "./helpers/firebase.js"
import express from "express";
import expressValidator from "express-validator";
import json from "body-parser";
import userRoutes from "./routes/user.route.js";
import mediaRoutes from "./routes/media.route.js";
import cors from "cors";
import multerGridFS from './helpers/multerGridFS.js'
import database from './helpers/database.js'

const PORT = process.env.PORT;
const API_URL = process.env.API_ROUTE;

const app = express();


//app.disable("x-powered-by");
app.use(
  expressValidator({
    customValidators: {
      isNotUndefined: value => value !== undefined
    }
  })
);
app.use(json());
app.use(cors());

// user non authorized
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({
      message: err.name + ": " + err.message
    });
  }
});

//########################################
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({
      status: "error",
      message: "invalid json request format"
    });
  } else {
    next();
  }
});
//##########################################

const conn = database.connectToServer()

conn.on('error', () => {
  console.error('Database connection failed.')
})
conn.once('open', () => {
  console.info('Database connection success')

  multerGridFS.initStorage()
})

//#################################################
let firebaseConfig = _firebase;
initializeApp(firebaseConfig);
import {
  initfire
} from "./helpers/firebase";
initfire();
//################################################

app.use(API_URL + "/users", userRoutes);
app.use(API_URL + "/medias", mediaRoutes);

app.use(API_URL + "/users", users_routes);
//every other route send error 404
app.all("*", (req, res) => {
  res.status(404).send();
});

// Listen on port
let server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Initialize server shutdown method
server = require("http-shutdown")(server);

// Close all server connections upon interrupt signal
process.on("SIGINT", () => {
  console.log("Stopping API server");

  server.shutdown(() => {
    console.log("Exited process");
    process.exit(1);
  });
});