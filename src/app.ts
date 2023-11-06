// app.ts
import express from 'express';
import http from 'http';
import {v1Router} from './routes';
import logger, {expressLogger} from './utils/logger.util';
import {connectsDB} from './utils/db.util';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import {examSocketController} from './controllers/socket.controller';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
examSocketController(io);

const port = process.env.PORT || 5000;

app.use(expressLogger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/v1', v1Router);

async function startServer() {
  try {
    await connectsDB();
    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Error starting server: ', error);
  }
}

startServer();
