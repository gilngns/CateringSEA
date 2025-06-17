import express from 'express';
import userRoutes from './routes/userRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(helmet());
app.use('/api/users', userRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use(cors({ origin: 'http://localhost:3000' })); 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
  });
  
  app.use(limiter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
