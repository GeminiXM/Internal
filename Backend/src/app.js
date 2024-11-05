"use strict";
// Other middleware and routes...
import express from "express";
import Routes from "./routes/db.routes.js";
import cors from "cors";


const app = express();

// Enable CORS for all routes - this allows the frontend to talk to the backend api
app.use(cors());


//app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json()); //so it understand entries from the body for create
app.use("/",Routes);

console.log("The app.js file has been read");

export default app;

