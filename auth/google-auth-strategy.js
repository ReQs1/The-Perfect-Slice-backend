const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const { sql } = require("../db/db");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async function (_, _, _, profile, done) {
      try {
        const { sub: googleId, name, email, picture } = profile._json;

        let user;

        const existingUser = await sql(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        if (existingUser.length === 0) {
          const [newUser] = await sql(
            "INSERT INTO users (google_id, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *",
            [googleId, name, email, picture]
          );

          user = newUser;
        } else {
          user = existingUser[0];
        }

        const accessToken = jwt.sign(
          {
            userId: user.id,
            isAdmin: user.is_admin,
          },

          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          {
            userId: user.id,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "30d" }
        );

        return done(null, { ...user, accessToken, refreshToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
