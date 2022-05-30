import pg from "pg";
import dotenv from "dotenv";

import { info, error } from "./logging/logging.js"

dotenv.config();

const { Pool } = pg;

let db = null;

try {
    
    const databaseConfig = {
        connectionString: process.env.DATABASE_URL
    };

    if (process.env.MODE === "PROD") {
      databaseConfig.ssl = {
          rejectUnauthorized: false
      }  
    }
    
    db = new Pool(databaseConfig);

    
    console.log(info("Connection to postgres database successfully established..."));

} catch (e) {
    console.log(error("Error connecting to protgres database...\n "), e);
    process.exit();
}

export default db;