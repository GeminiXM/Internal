// File: MainPage.js

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./mainPage.module.css";
import CredentialForm from "../login/page.js";

const MainPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    if (authToken && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLoginSuccess = (token, username) => {
    localStorage.setItem("authToken", token); // Save the token to localStorage
    localStorage.setItem("username", username); // Save the username to localStorage
    setIsAuthenticated(true);
    setUsername(username);
    setShowLoginModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <h1>Wellbridge Internal</h1>
        {isAuthenticated && (
          <div className={styles.usernameDisplay}>Welcome, {username}</div>
        )}
        {!isAuthenticated && (
          <button className={styles.loginButton} onClick={handleLoginClick}>
            Login
          </button>
        )}
      </header>
      <main className={styles.mainContent}>
        <div className={styles.buttonContainer}>
          <Link href="/IFees">
            <button className={styles.ifeesButton}>Go to IFees Page</button>
          </Link>
        </div>
      </main>
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CredentialForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
