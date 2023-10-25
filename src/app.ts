// app.ts
import express from 'express';
import { v1Router } from './routes';
import logger, { expressLogger } from './utils/logger.util';
import { connectsDB } from './utils/db.util';
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(expressLogger);

app.use("/api/v1", v1Router);

async function startServer() {
  try {
    await connectsDB();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Error starting server: ", error);
  }
}

startServer();
