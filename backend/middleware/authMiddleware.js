import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const normalizeRole = (role) => {
  if (role === 'user') {
    return 'guest';
  }

  return role;
};

// ─── CORE MIDDLEWARE ──────────────────────────────────────────────────────────

// Authenticate any logged-in user regardless of role.
// Populates req.user for all downstream controllers.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('User not found'));
    }

    // Support legacy guest tokens/user documents that used "user" or lacked a role.
    req.user.role = normalizeRole(req.user.role) || normalizeRole(decoded.role) || 'guest';

    next();
  } catch {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

// Restrict access to specific roles.
// Always use AFTER protect middleware.
// Usage: authorize('admin', 'superAdmin')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Access denied: requires ${roles.join(' or ')} role`));
  }
  next();
};

// ─── CONVENIENCE ALIASES ─────────────────────────────────────────────────────
// These are arrays that Express route handlers accept natively.
// Use them exactly as you would a single middleware function.

// Only logged-in guests can access
const protectUser = [protect, authorize('guest')];

// Only logged-in staff (admin or superAdmin) can access
const protectAdmin = [protect, authorize('admin', 'superAdmin')];

// Only superAdmin can access
const protectSuperAdmin = [protect, authorize('superAdmin')];

export { authorize, protect, protectAdmin, protectSuperAdmin, protectUser };
