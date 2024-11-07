"use strict";
// Other middleware and routes...
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

// Add your other routes
app.use("/", Routes);

// Login Route for Authentication
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user with Active Directory
    const isAuthenticated = await authenticateUser(username, password);
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if the user belongs to the IFees group
    const isInGroup = await isUserInIFeesGroup(username);
    if (!isInGroup) {
      return res
        .status(403)
        .json({ message: "User is not authorized for this service" });
    }

    // If both authentication and group check pass
    res
      .status(200)
      .json({ message: "Authenticated and authorized successfully" });
  } catch (error) {
    console.error("Error during authentication:", error);
    // Return specific errors based on the type of error
    if (error.message.includes("User not found")) {
      return res
        .status(404)
        .json({ message: "User not found. Please check your username." });
    } else if (error.message.includes("InvalidCredentialsError")) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please try again." });
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
});

console.log("The app.js file has been read");

export default app;
