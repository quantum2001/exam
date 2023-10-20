// app.ts
import express from 'express';
import { v1Router } from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1", v1Router);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
