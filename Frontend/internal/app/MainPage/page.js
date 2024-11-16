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
    setIsAuthenticated(true);
    localStorage.setItem("username", username);
    setUsername(username);
    setShowLoginModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Wellbridge Internal</h1>
        <div className={styles.authContainer}>
          {isAuthenticated ? (
            <div className={styles.usernameDisplay}>{username}</div>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.linksContainer}>
          <h2 className={styles.sectionTitle}>Quick Links</h2>
          <nav className={styles.navLinksContainer}>
            <Link href="/IFees" className={styles.linkButton}>
              IFees Enrollments
            </Link>
            {/* Future links can be added here */}
          </nav>
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
