"use strict";

import { getConnection } from "../database/connection.js";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// Obtain the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(path.dirname(__filename))); // Move up two directory levels to Backend\database

// Function to read SQL files from Backend\database
const readSQLFile = (filePath) => {
  return fs.readFileSync(path.resolve(__dirname, filePath), {
    encoding: "utf-8",
  });
};

// Function to fetch IFees
export const getIFees = async (req, res, next) => {
  console.log("Entering getIFees middleware");

  const { database } = req.query;

  try {
    console.log("Waiting on getConnection in db controllers file IFees");
    const connection = await getConnection(database);

    // Read the SQL query from the file
    const sqlQuery = readSQLFile("database/select_web_proc_GetIFees.sql");

    // Execute the query
    connection.query(sqlQuery, (err, result) => {
      connection.close(); // Close the connection once the query is executed
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({
          message: "Error 500: Internal server error in controller",
        });
      }

      if (result.length > 0) {
        console.log("SQL Query in getIFee has been read", result);
        return res.status(200).json(result);
      } else {
        console.log(`IFees not found, error 1`);
        return res.status(404).json({ message: `IFees not found` });
      }
    });
  } catch (err) {
    console.error("Error connecting to the Informix database:", err);
    return res
      .status(500)
      .json({ message: "Error 500: Internal server error in controller" });
  }
};

// Function to insert a new IFees record
export const insertIFee = async (req, res, next) => {
  console.log("Entering insertIFee middleware");
  const { description, startDate, endDate, price, enteredBy } = req.body;
  const { database } = req.query; // Fetch the selected database from query parameters

  if (!database) {
    console.error("Database not selected. Cannot proceed with insertion.");
    return res
      .status(400)
      .json({ message: "Error 400: Database not selected." });
  }

  console.log("Received data to insert:", {
    description,
    startDate,
    endDate,
    price,
    enteredBy,
  });
  console.log("Database selected:", database);

  try {
    const connection = await getConnection(database);

    // Construct the SQL query to insert a new IFees record
    const sqlQuery = `EXECUTE PROCEDURE web_proc_InsertIFee('${description}', '${startDate}', '${endDate}', ${price}, '${enteredBy}')`;
    console.log("SQL Query to be executed:", sqlQuery);

    // Execute the query
    connection.query(sqlQuery, (err, result) => {
      connection.close(); // Close the connection once the query is executed
      if (err) {
        console.error("Error executing insert query:", err);
        return res.status(500).json({
          message: "Error 500: Failed to insert new IFees record.",
        });
      }

      console.log("Insert query executed successfully:", result);
      return res
        .status(200)
        .json({ message: "IFees record inserted successfully" });
    });
  } catch (err) {
    console.error("Error connecting to the Informix database:", err);
    return res
      .status(500)
      .json({
        message: "Error 500: Internal server error in insert controller",
      });
  }
};
