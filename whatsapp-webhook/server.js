import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhookRoutes.js'; // Adjust path if necessary
import { createLogger, transports, format } from 'winston';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logging setup
const logger = createLogger({
  level: 'info',
  format: format.combine(format.colorize(), format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ],
});

// Middleware to parse incoming JSON
app.use(express.json());

// Use webhook routes
app.use('/', webhookRoutes); // This is where the /webhook endpoint is configured

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
