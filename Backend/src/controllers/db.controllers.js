"use strict";

import { getConnection } from "../database/connection.js"; // Assuming getConnection is correctly exported from your connection.js file
import fs from "fs-extra";
import path from "path";
import sql from "mssql";
import { fileURLToPath } from "url";
import { log, error } from "console";
import { request } from "http";
import { json } from "stream/consumers";

console.log("Here we are in the db controllers file");

// Obtain the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(path.dirname(__filename))); // Move up two directory levels to Backend\database

// Function to read SQL files from Backend\database
const readSQLFile = (filePath) => {
  return fs.readFileSync(path.resolve(__dirname, filePath), {
    encoding: "utf-8",
  });
};

console.log(`${readSQLFile}`);

export const getIFees = async (req, res, next) => {
  console.log("Entering getIFees middleware");
  const sqlQuery = readSQLFile("database/select_web_proc_GetIFees.sql");

  try {
    console.log("Waiting on getConnection in db controllers file IFees");
    req.pool = await getConnection(); // Obtain the connection pool

    const result = await req.pool.request().query(sqlQuery);

    if (result.recordset.length > 0) {
      console.log("SQL Query in getIFee has been read", result.recordset);
      // Send the data as JSON response
      return res.status(200).json(result.recordset);
    } else {
      console.log(`IFees not found, error 1`);
      return res.status(404).json({ message: `IFees not found` });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error 500: Internal server error in controller" });
  }
};
