const { sql } = require("../db/db");
const jwt = require("jsonwebtoken");

const ExpressError = require("../utils/ExpressError");
const { verifyJwtToken } = require("../utils/verify-jwt-token");

module.exports.userInfoController = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await sql(
      "SELECT id, name, email, picture, is_admin FROM users WHERE id = $1",
      [userId]
    );

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user.at(0) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new ExpressError("No refresh token provided", 401);
    }

    const userId = verifyJwtToken("refresh_token", refreshToken);

    const userQuery = await sql("SELECT * FROM users WHERE id = $1", [userId]);

    if (!userQuery.length) {
      throw new ExpressError("User not found", 404);
    }

    const user = userQuery.at(0);

    const newAccessToken = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
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
