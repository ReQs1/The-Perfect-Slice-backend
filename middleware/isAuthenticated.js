const { verifyJwtToken } = require("../utils/verify-jwt-token");

module.exports.isAuthenticated = (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedInfo = verifyJwtToken("access_token", access_token);
    req.user = decodedInfo;
    next();
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
