"use strict";
import express from "express";
import { getIFees, insertIFee } from "../controllers/db.controllers.js";
import {
  authenticateUser,
  isUserInIFeesGroup,
  verifyToken,
} from "../authorization/adAuth.js"; // Ensure the correct path
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "MySuperSecretKey"; // Replace with a secure secret key


// Verify token endpoint
router.post("/verify-token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from the "Authorization" header

  if (!token) {
    console.log("No token found in request headers."); // Debug log
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err); // Log detailed error
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("Token successfully verified for user:", user); // Debug log
    return res.status(200).json({ message: "Token is valid" });
  });
});



// Route for fetching IFees data
router.get("/IFees", getIFees);

// Route for inserting IFees data
router.post("/IFees", verifyToken, insertIFee);

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

    // Generate JWT token on successful authentication
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" }); //expires in this many hours

    return res.status(200).json({
      message: "User authenticated and authorized",
      token, // Send the token back to the client
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
