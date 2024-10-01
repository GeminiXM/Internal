// routes.js
"use strict";
import express from "express";
import {
  getIFees
} from "../controllers/db.controllers.js";

const router = express.Router();

// Route for fetching iFees data
router.get("/IFees", getIFees);



export default router;
