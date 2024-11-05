// connection.js - This file handles connecting to one of the Informix databases based on the user's selection.

"use strict";

import ibmdb from "ibm_db"; // Ensure ibmdb is imported
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// Function to create a connection string for Informix
const createConnectionString = (databaseConfig) => {
  const {
    server,
    database,
    host,
    port,
    protocol,
    user,
    password,
    authentication,
  } = databaseConfig;

  const connectionString = `SERVER=${server};DATABASE=${database};HOSTNAME=${host};AUTHENTICATION=${authentication};PORT=${port};PROTOCOL=${protocol};UID=${user};PWD=${password};`;
  console.log("Generated Connection String:", connectionString);
  return connectionString;
};

// Function to get database settings based on selected database
const getDatabaseConfig = (selectedDatabase) => {
  console.log("Getting database configuration for:", selectedDatabase);
  switch (selectedDatabase) {
    case "Denver":
      return {
        server: process.env.INFORMIX_DNV_SERVER,
        database: process.env.INFORMIX_DNV_DATABASE,
        host: process.env.INFORMIX_DNV_HOST,
        port: process.env.INFORMIX_DNV_PORT,
        protocol: process.env.INFORMIX_DNV_PROTOCOL,
        user: process.env.INFORMIX_DNV_USER,
        password: process.env.INFORMIX_DNV_PASSWORD,
        authentication: process.env.INFORMIX_DNV_AUTHENTICATION,
      };
    case "MAC":
      return {
        server: process.env.INFORMIX_MAC_SERVER,
        database: process.env.INFORMIX_MAC_DATABASE,
        host: process.env.INFORMIX_MAC_HOST,
        port: process.env.INFORMIX_MAC_PORT,
        protocol: process.env.INFORMIX_MAC_PROTOCOL,
        user: process.env.INFORMIX_MAC_USER,
        password: process.env.INFORMIX_MAC_PASSWORD,
        authentication: process.env.INFORMIX_MAC_AUTHENTICATION,
      };
    case "NMSW":
      return {
        server: process.env.INFORMIX_NM_SERVER,
        database: process.env.INFORMIX_NM_DATABASE,
        host: process.env.INFORMIX_NM_HOST,
        port: process.env.INFORMIX_NM_PORT,
        protocol: process.env.INFORMIX_NM_PROTOCOL,
        user: process.env.INFORMIX_NM_USER,
        password: process.env.INFORMIX_NM_PASSWORD,
        authentication: process.env.INFORMIX_NM_AUTHENTICATION,
      };
    default:
      throw new Error("Invalid database selected");
  }
};

// Function to connect to Informix database
export const getConnection = async (selectedDatabase) => {
  console.log("Connecting to the selected database:", selectedDatabase);
  const databaseConfig = getDatabaseConfig(selectedDatabase);

  try {
    const connStr = createConnectionString(databaseConfig);
    console.log("Attempting to open connection...");
    const connection = await ibmdb.open(connStr);
    console.log("Connection successful to the database:", selectedDatabase);
    return connection;
  } catch (error) {
    console.error("Error connecting to the Informix database:", error);
    throw error;
  }
};

//Example usage (uncomment below for testing)
//run node src\database\connection.js from Backend
/* getConnection("Denver")
  .then((conn) => {
    console.log("Connection object:", conn);
    conn.close(() => {
      console.log("Connection closed.");
    });
  })
  .catch((err) => {
    console.error("Failed to connect:", err);
  }); */
