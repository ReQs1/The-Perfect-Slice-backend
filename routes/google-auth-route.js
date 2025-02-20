const express = require("express");
const router = express.Router();
require("dotenv").config();

const passport = require("passport");

const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  refreshTokenController,
  userInfoController,
} = require("../controllers/google-auth-controller");

const CLIENT_URL = process.env.CLIENT_URL;

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
    session: false,
  }),
  (req, res) => {
    res.cookie("access_token", req.user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Set refresh token cookie
    res.cookie("refresh_token", req.user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect(CLIENT_URL);
  }
);

router.get("/user", isAuthenticated, userInfoController);

router.post("/refresh-token", refreshTokenController);

module.exports = router;
