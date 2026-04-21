import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const normalizeRole = (role) => {
  if (role === 'user') {
    return 'guest';
  }
  return role;
};

// ─── CORE MIDDLEWARE ──────────────────────────────────────────────────────────

// Authenticate any logged-in user regardless of role.
// Populates req.user for all downstream controllers.
// FIX: Admin accounts are in the Admin model, not the User model.
// The JWT payload contains the role so we route to the correct collection.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;
    if (decoded.role === 'admin' || decoded.role === 'superAdmin') {
      // Admin tokens — look up in the Admin collection
      account = await Admin.findById(decoded.id).select('-password');
    } else {
      // Guest/user tokens — look up in the User collection
      account = await User.findById(decoded.id).select('-password');
    }

    if (!account) {
      res.status(401);
      return next(new Error('Account not found'));
    }

    req.user = account;
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

// Only logged-in guests can access user booking and dining routes.
// Admin or superAdmin accounts should not use guest reservation/order endpoints.
const protectUser = [protect, authorize('guest')];

// Only logged-in staff (admin or superAdmin) can access
const protectAdmin = [protect, authorize('admin', 'superAdmin')];

// Only superAdmin can access
const protectSuperAdmin = [protect, authorize('superAdmin')];

export { authorize, protect, protectAdmin, protectSuperAdmin, protectUser };
