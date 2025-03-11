require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");

var cors = require("cors");
const cookieParser = require("cookie-parser");
require("./auth/google-auth-strategy");

const googleAuthRoute = require("./routes/google-auth-route");
const commentsRoute = require("./routes/comments-route");
const likesRoute = require("./routes/likes-route");

// Define rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts, please try again later",
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(globalLimiter);
app.use("/auth", authLimiter);

app.use("/auth", googleAuthRoute);
app.use("/api", commentsRoute);
app.use("/api", likesRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
