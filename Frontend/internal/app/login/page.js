"use client";

import React, { useState } from "react";

const CredentialForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setMessage(""); // Clear previous messages

    // Add 'corpnet\' prefix if it doesn't exist
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
        setMessage(data.message);
      } else {
        const data = await response.json();
        if (response.status === 401) {
          setError("Invalid username or password. Please try again.");
        } else if (response.status === 403) {
          setError(
            "You are not authorized to access this service. Please contact support."
          );
        } else if (response.status === 404) {
          setError("User not found. Please check your username.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      setError(
        "An error occurred while attempting to authenticate. Please check your network connection and try again."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Please enter your Wellbridge Computer Login and Password:</h3>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Authenticate</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default CredentialForm;
