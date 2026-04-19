
/**
 * Admin model has been merged into User model as part of role-based authentication.
 * Staff accounts now use the User model with role: 'admin' or role: 'superAdmin'.
 * This file is kept for safe backward compatibility — any old import of Admin
 * will transparently receive the User model.
 */
export { default } from './User.js';

