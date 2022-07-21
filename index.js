// Imports
const express = require("express");
const request = require("request");
const dotenv = require("dotenv");
const cors = require("cors");

// Basic configuration
const port = process.env.PORT || 5000;
dotenv.config();

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_redirect_uri = process.env.SPOTIFY_CALLBACK_URI;
let access_token = "";

const app = express();

const generateRandomString = function (length) {
  let randomText = "";
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    randomText += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return randomText;
};

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
  })
);

/**
 * Routes
 */

app.get("/auth/login", (_req, res) => {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`);
});

app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: "Basic " + Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect(process.env.FRONTEND_URI);
    }
  });
});

app.get("/auth/token", (_req, res) => {
  res.json({
    access_token: access_token,
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
