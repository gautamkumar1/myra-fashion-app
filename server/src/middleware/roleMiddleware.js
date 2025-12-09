export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure authenticate middleware has been called first
    if (!req.user || !req.user.userType) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Convert single role to array for consistent handling
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};

