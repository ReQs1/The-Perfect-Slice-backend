const ExpressError = require("./ExpressError");
const jwt = require("jsonwebtoken");

module.exports.verifyJwtToken = (type, token) => {
  if (type === "access_token") {
    try {
      const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

      return decodedInfo;
    } catch (e) {
      throw new ExpressError(e.message, 401);
    }
  }

  if (type === "refresh_token") {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userId;
    } catch (e) {
      throw new ExpressError(e.message, 401);
    }
  }
};
