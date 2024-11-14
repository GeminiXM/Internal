"use strict";
import express from "express";
import { getIFees, insertIFee } from "../controllers/db.controllers.js";
import {
  authenticateUser,
  isUserInIFeesGroup,
} from "../authorization/adAuth.js"; // Ensure the correct path

const router = express.Router();

// Route for fetching IFees data
router.get("/IFees", getIFees);

// Route for inserting IFees data
router.post("/IFees", insertIFee);

// Route for handling user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user
    const isAuthenticated = await authenticateUser(username, password);
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify if the user is part of the required security group
    const isInGroup = await isUserInIFeesGroup(username);
    if (!isInGroup) {
      return res
        .status(403)
        .json({ message: "User is not authorized to perform this action" });
    }

    return res
      .status(200)
      .json({ message: "User authenticated and authorized" });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
