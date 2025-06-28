import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ redirect: '/login' });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ redirect: '/login' });
    }
    return res.redirect('/login');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Akses ditolak. Khusus admin.' });
  }
  next();
};


export { authMiddleware, isAdmin};
