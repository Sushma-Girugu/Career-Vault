const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log(
      "AUTH MIDDLEWARE:",
      req.method,
      req.originalUrl
    );

    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      console.log("AUTH ERROR: Authorization header missing");

      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log(
        "AUTH ERROR: Authorization header is not Bearer"
      );

      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("AUTH ERROR: Token missing");

      return res.status(401).json({
        message: "Authentication token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "AUTH TOKEN VERIFIED"
    );

    // Normalize user ID
    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    if (!userId) {
      console.log(
        "AUTH ERROR: User ID not found in token"
      );

      return res.status(401).json({
        message:
          "Invalid token: user ID not found"
      });
    }

    // Make sure all routes can use req.user.id
    req.user = {
      ...decoded,
      id: userId
    };

    console.log(
      "AUTH USER ID:",
      req.user.id
    );

    next();

  } catch (error) {
    console.error(
      "AUTHENTICATION ERROR:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;