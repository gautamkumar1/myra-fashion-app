import 'dotenv/config';
import express from 'express';
import connectDB from './utils/db.js';
import seedAdmin from './utils/seedAdmin.js';
import adminRoutes from './routes/adminRoutes.js';
import salesmanRoutes from './routes/salesmanRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import cors from 'cors';
const port = process.env.PORT || 3000;
const app = express();

// CORS configuration: allow all origins in development, specific origins in production
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(cors({
  origin: isDevelopment ? true : 'http://localhost:8081', // Allow all origins in dev, specific in prod
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/admin', adminRoutes);
app.use('/salesman', salesmanRoutes);
app.use('/warehouse', warehouseRoutes);
connectDB().then(async () => {
  // await seedAdmin(); // close for now becuase currently we already have an admin
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});