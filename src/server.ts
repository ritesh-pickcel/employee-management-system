import * as dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import { connectToDatabase } from './database';

// Import Route file
import { empRouter } from './employee.routes';

// Load envornment variable
dotenv.config();

const { DB_URI } = process.env;

if (!DB_URI) {
    console.error("No DB_URI Found");
    process.exit(1);
}

connectToDatabase(DB_URI)
    .then(() => {
        const app = express();

        app.use(cors());

        app.use('/api', empRouter);

        app.listen(5200, () => { console.log(`Serve is Running at http://localhost:5200`) })
    }

    ).catch(
        error => console.error(error)
    )