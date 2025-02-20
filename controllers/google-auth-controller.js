const { sql } = require("../db/db");
const jwt = require("jsonwebtoken");

const ExpressError = require("../utils/ExpressError");

module.exports.userInfoController = async (req, res) => {
  try {
    const user = await sql(
      "SELECT id, name, email, picture FROM users WHERE id = $1",
      [req.user.userId]
    );
    res.json(user[0]);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports.refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new ExpressError("No refresh token provided", 401);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await sql("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    if (!user.length) {
      throw new ExpressError("User not found", 401);
    }

    const newAccessToken = jwt.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
