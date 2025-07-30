const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Handles both "userId" and "id" fields in token
    req.user = {
      id: decoded.userId || decoded.id,
      role: decoded.role
    };

    if (!req.user.id) {
      return res.status(401).json({ error: 'Invalid token: user id missing.' });
    }

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware to verify instructor role
const verifyInstructor = (req, res, next) => {
  if (req.user?.role === 'instructor') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Instructor role required.' });
};

module.exports = {
  verifyToken,
  verifyInstructor
};
