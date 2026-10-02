import express from 'express';
import cors from 'cors';
import pecasRoutes from './routes/pecasRoutes.js';
import router from './routes/pecasRoutes.js';
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de checagem inicial (Health Check)
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'API Case AutoPeças operacional!',
        status: 'online'
    });
});

app.use('/', router);

export default app;