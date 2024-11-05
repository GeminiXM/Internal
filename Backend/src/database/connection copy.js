"use strict";

import ibmdb from "ibm_db"; // Use ibm_db library for Informix
import dotenv from "dotenv";

dotenv.config();

// Log environment variables for debugging
console.log("Environment variables:");
console.log(`INFORMIX_DNV_SERVER: ${process.env.INFORMIX_DNV_SERVER}`);
console.log(`INFORMIX_MAC_SERVER: ${process.env.INFORMIX_MAC_SERVER}`);
console.log(`INFORMIX_NM_SERVER: ${process.env.INFORMIX_NM_SERVER}`);

// Function to create a connection string for Informix
const createConnectionString = (dsn, user, password) => {
  console.log("DSN:", dsn);
  console.log("User:", user);
  console.log("Password:", password);
  const connectionString = `DSN=${dsn};UID=${user};PWD=${password};`;
  console.log("Generated Connection String:", connectionString);
  return connectionString;
};




// Function to dynamically determine the connection settings based on the selected database
const getDbSettings = (database) => {
  switch (database) {
    case "Denver":
      return {
        dsn: process.env.INFORMIX_DNV_DSN, // DSN name defined in your environment file
        user: process.env.INFORMIX_DNV_USER,
        password: process.env.INFORMIX_DNV_PASSWORD,
      };
    case "MAC":
      return {
        dsn: process.env.INFORMIX_MAC_DSN,
        user: process.env.INFORMIX_MAC_USER,
        password: process.env.INFORMIX_MAC_PASSWORD,
      };
    case "NMSW":
      return {
        dsn: process.env.INFORMIX_NM_DSN,
        user: process.env.INFORMIX_NM_USER,
        password: process.env.INFORMIX_NM_PASSWORD,
      };
    default:
      throw new Error("Invalid database selected");
  }
};

export const getConnection = async (selectedDatabase) => {
  const dbSettings = getDbSettings(selectedDatabase);
  const connStr = createConnectionString(
    dbSettings.dsn,
    dbSettings.user,
    dbSettings.password
  );

  console.log(
    `Attempting to connect to database ${dbSettings.dsn},${dbSettings.user}, ${dbSettings.password}...`
  );

  try {
    const connection = await ibmdb.open(connStr); // Create the connection
    console.log(
      "Finished connecting to the database via getConnection in the connection.js file"
    );
    return connection;
  } catch (error) {
    console.error("Error connecting to the Informix database:", error);
    throw error;
  }
};
