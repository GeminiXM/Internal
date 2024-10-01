"use strict";

import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

console.log("Environment variables:");
console.log(`SQL_USER: ${process.env.SQL_USER}`);
console.log(`SQL_PASSWORD: ${process.env.SQL_PASSWORD}`);
console.log(`SQL_SERVER: ${process.env.SQL_SERVER}`);
console.log(`SQL_DATABASE: ${process.env.SQL_DATABASE}`);
console.log(`SQL_PORT: ${process.env.SQL_PORT}`);
console.log(`SQL_ENCRYPT: ${process.env.SQL_ENCRYPT}`);

const dbSettings = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  domain: "corpnet.com",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

console.log("dbSettings has been set in connection.js");

let pool;

export const getConnection = async () => {
  if (!pool) {
    console.log(
      `Attempting to connect to database ${dbSettings.database} on ${dbSettings.server}...`
    );
    try {
      pool = await sql.connect(dbSettings);
      console.log(
        "Finished connecting to database via getConnection in the connection.js file"
      );
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }
  return pool;
};
import { config } from "dotenv";
