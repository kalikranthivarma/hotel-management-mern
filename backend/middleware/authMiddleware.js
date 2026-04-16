import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Protect routes that require a logged-in Guest (User)
const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'user') {
        res.status(403);
        return next(new Error('Access denied: this route is for guests only'));
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('User not found'));
      }

      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

// Protect routes that require a logged-in Staff Member (Admin)
const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'admin') {
        res.status(403);
        return next(new Error('Access denied: this route is for staff only'));
      }

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        res.status(401);
        return next(new Error('Staff account not found'));
      }

      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

// Restrict to SuperAdmin department only
const superAdmin = (req, res, next) => {
  if (req.admin && req.admin.department === 'SuperAdmin') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied: SuperAdmin only'));
  }
};

export { protectAdmin, protectUser, superAdmin };
