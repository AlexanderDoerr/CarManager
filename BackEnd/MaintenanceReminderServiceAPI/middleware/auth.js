const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const verifyToken = (token) => {
    try {
      // Token verification
      return jwt.verify(token, secret);
    } catch (e) {
      console.error("Token verification failed: ", e.message); // Log the error, consider a logging library for production
      return null;
    }
  };
  
  const authenticateUser = (req, res, next) => {
      try {
          // Extract token
          if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = req.headers.authorization.split(' ')[1];
        
          const payload = verifyToken(token);
          
          if (payload) {
              req.user = payload;
              next();
          } else {
              // Centralized response for failed authentication
              throw new Error("Payload is null, token might be invalid or expired");
          }
      } catch (e) {
          // Unified error handling
          console.error("Authentication error: ", e.message);
          res.status(401).json({ message: 'Authentication failed' });
      }
  };

module.exports = {
    authenticateUser
};