import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";
import { info } from "./logging/logging.js";

dotenv.config();

const app = express();
app.use(cors());


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(info(`The application is running on port ${PORT}...`));
});