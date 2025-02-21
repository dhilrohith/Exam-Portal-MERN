import jwt from 'jsonwebtoken';

/**
 * Protect routes by ensuring a valid JWT token is provided.
 */
export const protect = (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization
        .split(' ')[1];
        // Verify token and attach the decoded payload to req.user
        const decoded = jwt.verify(
          token, process.env.JWT_SECRET
        );
        req.user = decoded;
        return next();
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
  
  /**
   * Authorize based on user roles.
   * Usage: authorize('admin', 'proctor')
   */
  export const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'User role not authorized to access this resource' });
      }
      next();
    };
  };

 