import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(cors()); // Habilita peticiones desde cualquier origen (React en localhost)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logger de peticiones HTTP en consola

// Montaje de rutas de la API
app.use('/api', apiRouter);

// Manejo de 404 para rutas inexistentes
app.use(notFoundHandler);

// Middleware centralizado de errores (a prueba de caídas)
app.use(errorHandler);

export default app;
