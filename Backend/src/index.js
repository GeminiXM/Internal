"use strict";
import app from "./app.js";

app.get("/", (req, res) => {
  console.log(req.url); // Log the URL requested by the client
  res.send("Hello World from Backend index.js");
});

const PORT = process.env.EXPRESS_PORT || 9000;
const HOST_URL = process.env.EXPRESS_HOST_URL;

app.listen(PORT, () => {
  console.log(
    `Backend API for Informix is running on port ${PORT}. You can use ${HOST_URL} to test the backend, and http://vwbWebDev:9000/ to test the frontend.`
  );
});

// Cleaned up outdated comments and unnecessary imports
