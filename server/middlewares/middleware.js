const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

// Middleware function to verify JWT token
const IsAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    //verify role
    if (['Assistant RH', 'Responsable RH', 'Manager', 'Validator', 'Admin','Student'].includes(decoded.role))
      next();
    else {
      return res.status(401).json({ message: 'No Role' });
    }
  }
  );

};

// Middleware function to check role inclusion
const checkRole = (roles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    if (!userRoles || !Array.isArray(userRoles)) {
      return res.status(403).json({ message: 'User roles not provided or invalid' });
    }

    // Check if any of the user roles match the required roles
    const roleMatched = roles.some(role => userRoles.includes(role));

    if (!roleMatched) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { IsAdmin, checkRole };