"use strict";
import app from "./app.js";

app.get("/", (req, res) => {
  console.log(req.url); // Access the URL requested by the client
  res.json;
  res.send("Hello World from Backend index.js");
});


const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST;
const HOST_URL = process.env.HOST_URL;

app.listen(PORT, () => {
  console.log(
    `Backend API SQL Server is running on Host ${HOST}, port ${PORT} use:: ${HOST_URL} to test Backend, and http://vwbWebDev:9000/ to test Frontend`
  );
});

// C:\Users\dba_master\source\repos\Web Development\Node-js_SQL_API Template\Backend> npm start
// To Test use: http://vwbWebDev:8080/products
// http://vwbWebDev:8080/memberships/083376
import { json } from "express";
