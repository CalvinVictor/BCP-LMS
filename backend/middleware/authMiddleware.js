const jwt = require('jsonwebtoken');

// 1. Renamed 'authenticate' to 'verifyToken' for clarity
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adds user payload ({ id, role }) to the request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// 2. Added the missing 'verifyInstructor' middleware
const verifyInstructor = (req, res, next) => {
  // This middleware must run *after* verifyToken
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Instructor role required.' });
  }
};

// 3. Exported both functions in an object
module.exports = {
  verifyToken,
  verifyInstructor,
};