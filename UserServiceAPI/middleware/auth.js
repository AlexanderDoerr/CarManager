// auth.js
const jwt = require('jsonwebtoken');

// Utilize environment variables for sensitive data
const secret = process.env.JWT_SECRET || 'fallbacksecret';// Fallback should be avoided in production

const generateToken = (user) => {
  const payload = {
    id: user.UserId,
  };
  // Token generation with expiration
  console.log("Secret: ", secret);
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

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
    generateToken,
    authenticateUser
};
