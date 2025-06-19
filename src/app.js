// =========================
// 📦 Import Modules
// =========================
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

// Setup __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// =========================
// 🛡️ Middlewares
// =========================
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ROOT_DIR = process.cwd();


// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(ROOT_DIR, 'public')));
app.use('/uploads', express.static('uploads'));

// =========================
// 🖼️ Set EJS View Engine
// =========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =========================
// 🌐 Routes (Frontend Pages)
// =========================
app.get('/', (req, res) => {
  res.redirect('/login');
});
app.get('/login', (req, res) => {
  res.render('Auth/login');
});
app.get('/register', (req, res) => {
  res.render('Auth/register');
});

// =========================
// 📡 API Routes
// =========================
app.use('/api/users', userRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/testimonials', testimonialRoutes);

// =========================
// 🚀 Start Server
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
