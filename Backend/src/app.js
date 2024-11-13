"use strict";
import express from "express";
import Routes from "./routes/db.routes.js";
import cors from "cors";
import {
  authenticateUser,
  isUserInIFeesGroup,
} from "../src/authorization/adAuth.js"; // Import AD functions

const app = express();

// Enable CORS for all routes - this allows the frontend to talk to the backend API
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Use Routes from db.routes.js
app.use("/", Routes);

console.log("The app.js file has been read");

export default app;
