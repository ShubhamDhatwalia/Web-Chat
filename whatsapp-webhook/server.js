import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhookRoutes.js'; // Adjust path if necessary
import { createLogger, transports, format } from 'winston';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const logger = createLogger({
  level: 'info',
  format: format.combine(format.colorize(), format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ],
});


app.use(express.json());


app.use('/', webhookRoutes); 


app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
