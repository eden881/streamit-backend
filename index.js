// Imports
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const data = require("./data.json");

// Basic configuration
const port = process.env.PORT || 5000;
dotenv.config();

// Set up app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
  })
);

/**
 * Routes
 */
app.get("/api/songs", (_req, res) => {
  res.send(data.songs);
});

// Run app
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
