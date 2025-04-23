import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhookRoutes.js';  
import cors from 'cors';



app.use(cors());
app.options('*', cors()); // Enable preflight requests for all routes


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;




app.use(express.json());


app.use('/', webhookRoutes); 


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
