import express from "express";
import { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";
import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";

import { info } from "./logging/logging.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(json());

// Routers
app.use(categoriesRouter);
app.use(gamesRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(info(`The application is running on port ${PORT}...`));
});