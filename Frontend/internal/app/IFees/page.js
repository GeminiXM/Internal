"use client";

import React, { useState, useEffect, useRef } from "react";
import CredentialForm from "../login/page.js";
import Modal from "react-modal";
import styles from "./IFees.module.css"; // Import the CSS module
import loginStyles from "../login/login.module.css"; // Import login-specific CSS for modal styling
import Search from "../Search/search"; // Corrected import path

// Set the app element for Modal
Modal.setAppElement("body"); // Use the main app element for accessibility (adjust the selector if needed)

const IFeesPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iFeesData, setIFeesData] = useState([]);
  const [filteredIFees, setFilteredIFees] = useState([]); // State for filtered data
  const [selectedDatabase, setSelectedDatabase] = useState("Denver");
  const [enteredBy, setEnteredBy] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [descriptionManuallyEdited, setDescriptionManuallyEdited] =
    useState(false); // Track if description was manually changed
  const [startDate, setStartDate] = useState(""); // State for start_date input
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const tableRef = useRef(null);
  const [deleteModeIntent, setDeleteModeIntent] = useState(false);


  // Remove token verification logic on mount
  useEffect(() => {
    fetchIFeesData(); // Call fetchIFeesData without checking token
  }, [selectedDatabase]);

  /* 
#
FUNCTIONS ################################################################################################################
#
#
*/

  // Move the fetchIFeesData function to be declared outside useEffect, so it can be called anywhere in the component
  const fetchIFeesData = async () => {
    try {
      console.log("Attempting to fetch IFees data..."); // Add this line
      const response = await fetch(
        `http://vwbwebdev:9090/IFees?database=${selectedDatabase}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch IFees data");
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Log received data

      setIFeesData(data);
      setFilteredIFees(data);
    } catch (error) {
      console.error("Error fetching IFees data:", error);
      alert("Error fetching IFees data. Check console for details.");
    }
  };

  // Function to handle opening the login modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the login modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEnteredBy(""); // Reset enteredBy state on modal close
  };

  // Function to handle successful authentication
const handleAuthenticationSuccess = (token, username) => {
  console.log("Authentication Success: Token:", token, "Username:", username); // Log to confirm the token and username are correct
  localStorage.setItem("authToken", token); // Store token locally
  localStorage.setItem("username", username);
  setIsAuthenticated(true); // This should enable the input fields
  setEnteredBy(username); // Store the logged-in username
  setIsModalOpen(false); // This should close the modal

  if (deleteModeIntent) {
    setShowDeleteMode(true); // Enable delete mode if delete was intended
    setDeleteModeIntent(false); // Reset intent
  }
};



  const validateToken = (token) => {
    try {
      const payloadBase64 = token.split(".")[1]; // Extract the payload part of the JWT
      const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode from Base64

      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedPayload.exp && decodedPayload.exp > currentTime) {
        return true; // Token is still valid
      }
    } catch (error) {
      console.error("Invalid token format or decoding error:", error);
    }
    return false; // Token is invalid or expired
  };


  // Fetch data on component mount and when database changes
useEffect(() => {
  const token = localStorage.getItem("authToken");

  if (token && validateToken(token)) {
    setIsAuthenticated(true); // Enable input fields if token is valid
  } else {
    localStorage.removeItem("authToken"); // Clear invalid/expired token
    setIsAuthenticated(false); // Ensure input fields are hidden
  }
}, []);


  // Function to handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredIFees(iFeesData); // Reset filtered data when search term is empty
      return;
    }

    const filtered = iFeesData.filter((entry) => {
      const description = entry.description
        ? entry.description.toLowerCase()
        : "";
      const price = entry.price ? entry.price.toString().toLowerCase() : "";
      const endDate = entry.end_date ? entry.end_date.toLowerCase() : "";
      const membershipType = entry.membership_type
        ? entry.membership_type.toLowerCase()
        : "";

      return (
        description.includes(searchTerm.toLowerCase()) ||
        price.includes(searchTerm.toLowerCase()) ||
        endDate.includes(searchTerm.toLowerCase()) ||
        membershipType.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredIFees(filtered);
  };

  // Function to dynamically adjust column widths based on content
  useEffect(() => {
    if (tableRef.current) {
      adjustColumnWidths();
    }
  }, [filteredIFees]); // Update based on filtered data

  const adjustColumnWidths = () => {
    const table = tableRef.current;
    const columns = table.querySelectorAll("th");
    const padding = 10; // Add 10px to each column width

    columns.forEach((col, colIndex) => {
      let maxWidth = 0;

      // Find the maximum width of content in each cell of the column
      table
        .querySelectorAll(`td:nth-child(${colIndex + 1})`)
        .forEach((cell) => {
          const cellContentWidth = cell.scrollWidth;
          maxWidth = Math.max(maxWidth, cellContentWidth);
        });

      // Set the width of the header and all cells in that column
      col.style.width = `${maxWidth + padding}px`;
      table
        .querySelectorAll(`td:nth-child(${colIndex + 1})`)
        .forEach((cell) => {
          cell.style.width = `${maxWidth + padding}px`;
        });
    });
  };

  // Function to determine row background color based on description match
  const getRowClass = (index) => {
    const description = iFeesData[index].description.trim();

    // Find all rows with the same description
    const groupStart = iFeesData.findIndex(
      (fee) => fee.description.trim() === description
    );

    // Calculate the group number by counting distinct descriptions up to this point
    const groupNumber = iFeesData
      .slice(0, groupStart)
      .reduce((count, fee, i, arr) => {
        // Count only unique descriptions
        return arr.findIndex(
          (f) => f.description.trim() === fee.description.trim()
        ) === i
          ? count + 1
          : count;
      }, 0);

    // Return the appropriate class based on the group number
    return groupNumber % 2 === 0 ? styles.White : styles.lightGoldenrodYellow;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the modal when Submit is clicked
  };

  // Function to handle form reset
  const resetForm = () => {
    setPrice("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setEndDateError("");
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setShowModal(false);
    resetForm(); // Reset all input fields
  };

  // Function to handle modal confirm
  const handleConfirm = async () => {
    console.log("Confirm button clicked. Preparing to send data...");

    setShowModal(false);

    const token = localStorage.getItem("authToken");
    const enteredBy = localStorage.getItem("username"); // Retrieve stored username

    try {
      const response = await fetch(
        `http://vwbwebdev:9090/IFees?database=${selectedDatabase}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            database: selectedDatabase, // Ensure this is included
            description,
            startDate,
            endDate,
            price,
            enteredBy, // Use the stored username
          }),
        }
      );

      console.log("Request sent to backend:", {
        description,
        startDate,
        endDate,
        price,
        enteredBy,
      });

      if (!response.ok) {
        throw new Error("Failed to insert new IFees record.");
      }

      // Refresh data after successful insertion
      await fetchIFeesData();

      console.log("Insert successful");
    } catch (error) {
      console.error("Error inserting IFees:", error);
    }
  };

  // Format date without converting time zones
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // Handle price change with validation and update description if not manually edited
  const handlePriceChange = (e) => {
    let value = e.target.value;

    // Remove any $ symbol if present
    value = value.replace(/\$/g, "");

    // Validate that the value is a number or decimal less than 500
    if (!isNaN(value) && parseFloat(value) < 500) {
      setPrice(value);
      setPriceError(""); // Clear any error if valid

      // Update description only if it was not manually edited or price is empty
      if (!descriptionManuallyEdited || description === "") {
        setDescription(`$${value} IFee Special`);
        setDescriptionManuallyEdited(false); // Reset manually edited flag
      }
    } else {
      setPrice(value);
      setPriceError("Price must be a number or decimal less than $500");
    }
  };

  // Handle manual changes to description
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setDescriptionManuallyEdited(true); // Mark as manually edited
  };

  // Handle start_date and end_date changes with validation
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);

    // Ensure start date is prior to the end date
    if (endDate && value >= endDate) {
      setEndDateError("Start Date must be before End Date.");
    } else {
      setEndDateError(""); // Clear error if valid
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);

    // Ensure end date is today or in the future
    const today = new Date().toISOString().split("T")[0];
    if (value < today) {
      setEndDateError("End Date must be today or later.");
    } else if (startDate && value <= startDate) {
      setEndDateError("End Date must be after Start Date.");
    } else {
      setEndDateError(""); // Clear error if valid
    }
  };

  // Function to handle delete button click
const handleDeleteButtonClick = () => {
  const token = localStorage.getItem("authToken");

  if (!token || !validateToken(token)) {
    alert("Authentication required. Please log in.");
    setDeleteModeIntent(true); // Track that delete mode was intended
    openModal();
    return;
  }

  setShowDeleteMode(true); // Enable delete mode if authenticated
};




  // Function to handle row selection
  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  /* 
#
WEB PAGE ################################################################################################################
#
#
*/

  return (
    <div className={styles.container}>
      {/* Left Pane: Form for Insert/Update */}
      <div className={styles.leftPane}>
        <label htmlFor="database-select">Select Database:</label>
        <select
          id="database-select"
          value={selectedDatabase}
          onChange={(e) => setSelectedDatabase(e.target.value)}
          className={styles.dropdown}
        >
          <option value="Denver">Denver</option>
          <option value="MAC">MAC</option>
          <option value="NMSW">NMSW</option>
        </select>

        {/* Separator */}
        <hr style={{ margin: "20px 0", borderColor: "#ccc" }} />

        {/* Button for New Enrollment */}
        <button onClick={openModal} className={styles.enrollmentButton}>
          Enter New Enrollment
        </button>

        {/* Input Fields and Submit Button (visible after authentication) */}
        {isAuthenticated && (
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            {/* Price input */}
            <label htmlFor="price">Price:</label>
            <div className={styles.priceContainer}>
              <span className={styles.dollarSign}>$</span>
              <input
                type="text"
                id="price"
                name="price"
                value={price}
                onChange={handlePriceChange}
                className={`${styles.formInput} ${styles.smallerInput}`}
              />
            </div>
            {priceError && <p className={styles.errorMsg}>{priceError}</p>}

            {/* Description field */}
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className={styles.formInput}
            />

            <label htmlFor="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={startDate}
              onChange={handleStartDateChange}
              className={`${styles.formInput} ${styles.smallerInput}`}
            />

            <label htmlFor="end_date">End Date:</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={endDate}
              onChange={handleEndDateChange}
              className={`${styles.formInput} ${styles.smallerInput}`}
              min={new Date().toISOString().split("T")[0]} // Prevent dates before today
            />
            {endDateError && <p className={styles.errorMsg}>{endDateError}</p>}

            {/* Submit button */}
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        )}
      </div>

      {/* 
      #
      RIGHT PANE ################################################################################################################
      #
      #
      */}
      {/* Right Pane: Table Display */}
      <div className={styles.rightPane}>
        <div className={styles.title}>
          Currently Active IFees (Enrollment) @ {selectedDatabase}
        </div>
        <div
          className={styles.top}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Search placeholder="Search ifees..." onSearch={handleSearch} />
          <button
            onClick={handleDeleteButtonClick}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              {showDeleteMode && <th className={styles.tableCell}>Select</th>}
              <th className={styles.tableCell}>Description</th>
              <th className={styles.tableCell}>Price</th>
              <th className={styles.tableCell}>End Date</th>
              <th className={styles.tableCell}>Membership Type</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredIFees) &&
              filteredIFees.map((fee, index) => (
                <tr
                  key={index}
                  className={`${styles.tableRow} ${getRowClass(index)}`}
                >
                  {showDeleteMode && (
                    <td className={styles.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleRowSelect(index)}
                      />
                    </td>
                  )}
                  <td className={styles.tableCell}>{fee.description.trim()}</td>
                  <td className={styles.tableCell}>{fee.price}</td>
                  <td className={styles.tableCell}>
                    {formatDate(fee.end_date)}
                  </td>
                  <td className={styles.tableCell}>
                    {fee.membership_type.trim()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Submit */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirm Submission"
          className={styles.modalContent}
          overlayClassName={styles.modalOverlay}
        >
          <h3 className={styles.modalTitle}>Confirm Submission</h3>
          <p className={styles.modalDescription}>Please review your entries:</p>
          <ul className={styles.modalList}>
            <li>
              <strong>Database:</strong> {selectedDatabase}
            </li>
            <li>
              <strong>Description:</strong> {description}
            </li>
            <li>
              <strong>Price:</strong> {price}
            </li>
            <li>
              <strong>Start Date:</strong> {startDate}
            </li>
            <li>
              <strong>End Date:</strong> {endDate}
            </li>
          </ul>
          <div className={styles.modalButtons}>
            <button onClick={handleConfirm} className={styles.confirmButton}>
              Confirm
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Login uses the login\page.js*/}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Authentication Modal"
        className={loginStyles.modalContent} // Use login styles for modal
        overlayClassName={loginStyles.modalOverlay}
      >
        {/* Heading in modal */}
        <h3 className={loginStyles.loginHeader}>Please log in to proceed</h3>

        {/* CredentialForm handles the login submission internally */}
        <CredentialForm onSuccess={handleAuthenticationSuccess} />

        {/* Only Cancel button here for modal close */}
        <button onClick={closeModal} className={loginStyles.cancelButton}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default IFeesPage;
