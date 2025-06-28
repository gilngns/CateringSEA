export default function requireLogin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized. Please login first.',
        redirect: '/login'
      });
    }
    next();
  }  