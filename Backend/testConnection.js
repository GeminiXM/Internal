"use strict";

// Enable ibm_db debug logging
process.env.DEBUG = "ibm_db:*";

import ibmdb from "ibm_db"; // Ensure ibmdb is imported

// Function to create a connection string
const createConnectionString = () => {
  const connectionString = `SERVER=svc_drda;DATABASE=denver;HOSTNAME=VWBBOSSDNV;AUTHENTICATION=SERVER;PORT=9089;PROTOCOL=TCPIP;UID=webdev;PWD=informixwebdev;`;
  console.log("Generated Connection String:", connectionString);
  return connectionString;
};
// Test the connection
ibmdb.open(createConnectionString(), (err, conn) => {
  if (err) {
    console.error("Detailed Error:", err);
  } else {
    console.log("Connection successful!");
    conn.close();
  }
});
