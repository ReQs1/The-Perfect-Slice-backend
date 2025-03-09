const express = require("express");
const router = express.Router();

const passport = require("passport");

const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  refreshTokenController,
  userInfoController,
  logoutController,
} = require("../controllers/google-auth-controller");

const CLIENT_URL = process.env.CLIENT_URL;

router.get("/google", (req, res, next) => {
  const state = encodeURIComponent(req.query.redirect || "/");
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
    state,
  })(req, res, next);
});

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
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refresh_token", req.user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const redirectTo = req.query.state
      ? decodeURIComponent(req.query.state)
      : "/";
    res.redirect(`${CLIENT_URL}${redirectTo}`);
  }
);

router.get("/user", isAuthenticated, userInfoController);

router.post("/refresh-token", refreshTokenController);

router.post("/logout", logoutController);

module.exports = router;
