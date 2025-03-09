require("dotenv").config();
const express = require("express");
const app = express();

var cors = require("cors");
const cookieParser = require("cookie-parser");
require("./auth/google-auth-strategy");

const googleAuthRoute = require("./routes/google-auth-route");
const commentsRoute = require("./routes/comments-route");
const likesRoute = require("./routes/likes-route");

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", googleAuthRoute);
app.use("/api", commentsRoute);
app.use("/api", likesRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
