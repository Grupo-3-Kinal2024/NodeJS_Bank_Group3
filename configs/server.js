import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { connectDB } from './database.js';

class Server {
    constructor() {
        this.app = express();
        this.port = config.port;

        this.middlewares();
        this.connectDB();
        this.routes();
    }

    async connectDB() {
        await connectDB();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes() {
        // Define tus rutas aquí, por ejemplo:
        // this.app.use('/api', require('./routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;