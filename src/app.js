  // =========================
  // 📦 Import Modules
  // =========================
  import express from 'express';
  import helmet from 'helmet';
  import cors from 'cors';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import dotenv from 'dotenv';
  import cookieParser from 'cookie-parser';

  // =========================
  // 🔐 Middlewares & Models
  // =========================
  import { authMiddleware, isAdmin } from './middleware/authMiddleware.js';
  import User from './models/userModel.js';

  // =========================
  // 📂 Import Routes
  // =========================
  import userRoutes from './routes/userRoutes.js';
  import mealPlanRoutes from './routes/mealPlanRoutes.js';
  import subscriptionRoutes from './routes/subscriptionRoutes.js';
  import testimonialRoutes from './routes/testimonialRoutes.js';

  // =========================
  // ⚙️ Setup Express App
  // =========================
  const app = express();
  dotenv.config();

  // Setup __dirname untuk ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const ROOT_DIR = process.cwd();

  // =========================
  // 🛡️ Global Middlewares
  // =========================
  app.use(helmet());
  app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials : true
   }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

 // 📃 Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://code.jquery.com",
        "https://www.googletagmanager.com",
        "https://unpkg.com",
        "https://cdn.datatables.net" 
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "http://178.128.106.41",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.lineicons.com",
        "https://cdn.datatables.net" 
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.lineicons.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://www.googletagmanager.com"
      ],
      connectSrc: [
        "'self'",
        "http://localhost:3000",
        "https://www.google-analytics.com",
        "https://lottie.host",
        "https://cdn.datatables.net"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);


  // =========================
  // 📁 Static Files
  // =========================
  app.use(express.static(path.join(ROOT_DIR, 'public')));
  app.use('/uploads', express.static('uploads'));
  app.use(express.static('public'));
  // =========================
  // 🖼️ Set EJS View Engine
  // =========================
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // =========================
  // 🌐 Frontend Routes
  // =========================
  app.get('/', (req, res) => res.render('index'));
  app.get('/contact', (req, res) => res.render('contact'));
  app.get('/subscription', (req,res) => res.render('subscription'));
  app.get('/menu', (req,res) => res.render('menu'));
  app.get('/login', (req, res) => res.render('Auth/login'));
  app.get('/register', (req, res) => res.render('Auth/register'));

  // Middleware admin khusus (return 404 jika bukan admin)
  const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).render('404');
    }
    next();
  };

  // Dashboard Pages
  app.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
    const userDetail = await User.findById(req.user.id);
    res.render('Dashboard/index', { user: userDetail });
  });

  app.get('/order', authMiddleware, async (req, res) => {
    const userDetail = await User.findById(req.user.id);
    res.render('Dashboard/order', {
      user: userDetail,
      role: userDetail.role
    });
  });

  app.get('/form-meal-plans', authMiddleware, adminMiddleware, async (req, res) => {
    const userDetail = await User.findById(req.user.id);
    res.render('Dashboard/form_meal_plans', { user: userDetail });
  });

  // =========================
  // 📡 API Routes
  // =========================
  app.use('/api/users', userRoutes);
  app.use('/api/meal-plans', mealPlanRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/testimonials', testimonialRoutes);

  // =========================
  // ❌ 404 Handler
  // =========================
  app.use((req, res) => {
    res.status(404).render('404');
  });

  // =========================
  // 🚀 Start Server
  // =========================
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
