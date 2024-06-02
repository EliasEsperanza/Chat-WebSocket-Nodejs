import express from 'express';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:8000'
};
app.use(cors(corsOptions));
app.use(express.json());

export default app;