// db.routes.js
"use strict";
import express from "express";
import { getIFees, insertIFee } from "../controllers/db.controllers.js";

const router = express.Router();

// Route for fetching IFees data
router.get("/IFees", getIFees);

// Route for inserting IFees data
router.post("/IFees", insertIFee);

export default router;
