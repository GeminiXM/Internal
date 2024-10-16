"use strict";

import { getConnection } from "../database/connection.js"; // Assuming getConnection is correctly exported from your connection.js file
import fs from "fs-extra";
import path from "path";
import sql from "mssql";
import { fileURLToPath } from "url";


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

// Function to map frontend database names to backend linked server names
const getDBServerName = (database) => {
  switch (database) {
    case "Denver":
      return "BOSS_Denver";
    case "MAC":
      return "BOSS_MAC";
    case "NMSW":
      return "BOSS_NEW_MEXICO";
    default:
      throw new Error("Invalid database selected");
  }
};

export const getIFees = async (req, res, next) => {
  console.log("Entering getIFees middleware");

  // Get the database parameter from the frontend request
  const { database } = req.query;
  let dbServer;

  try {
    dbServer = getDBServerName(database);
  } catch (err) {
    console.error("Invalid database selected:", err);
    return res.status(400).json({ message: "Invalid database selected" });
  }

  try {
    console.log("Waiting on getConnection in db controllers file IFees");
    req.pool = await getConnection();

    // Read the SQL query from the file
    const sqlQuery = readSQLFile("database/select_web_proc_GetIFees.sql");

    // Replace the placeholder with the actual server name dynamically
    const formattedSQLQuery = sqlQuery.replace(/BOSS_Denver/g, dbServer);

    const result = await req.pool.request().query(formattedSQLQuery);

    if (result.recordset.length > 0) {
      console.log("SQL Query in getIFee has been read", result.recordset);
      return res.status(200).json(result.recordset);
    } else {
      console.log(`IFees not found, error 1`);
      return res.status(404).json({ message: `IFees not found` });
    }
  } catch (err) {
    console.error("Error executing query:", err);
    return res
      .status(500)
      .json({ message: "Error 500: Internal server error in controller" });
  }
};




