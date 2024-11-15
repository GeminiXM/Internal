"use client";

import React, { useState } from "react";
import styles from "./login.module.css";

const CredentialForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null); // Clear previous errors

  let formattedUsername = username;
  if (!formattedUsername.toLowerCase().startsWith("corpnet\\")) {
    formattedUsername = `corpnet\\${formattedUsername}`;
  }

  try {
    const response = await fetch("http://vwbwebdev:9090/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formattedUsername, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login Response Data:", data); // Log the response for debugging

      if (data.token) {
        console.log("Token received:", data.token); // Log token for verification
        onSuccess(data.token, formattedUsername); // Pass token and username to parent component
      } else {
        setError("No token received. Please contact support.");
      }
    } else {
      const data = await response.json();
      if (response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else if (response.status === 403) {
        setError(
          "You are not authorized to access this service. Please contact support."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  } catch (error) {
    console.error("Network error during login:", error); // Log error
    setError("Network error. Please check your connection and try again.");
  }
};






  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className={styles.loginHeader}>
          Please enter your Wellbridge Computer Login and Password:
        </h3>

        <div
          style={{ marginBottom: "15px", display: "flex", alignItems: "left" }}
        >
          <label htmlFor="username" style={{ marginRight: "10px" }}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginRight: "10px" }}
          />
          <h5 style={{ margin: 0, fontWeight: "normal" }}>
            (usually first initial last name)
          </h5>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CredentialForm;
