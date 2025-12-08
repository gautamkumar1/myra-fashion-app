import 'dotenv/config';
import express from 'express';
import connectDB from './utils/db.js';
const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});