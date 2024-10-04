"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./IFees.module.css"; // Import the CSS module
import Search from "../Search/search"; // Corrected import path

const IFeesPage = () => {
  const [iFeesData, setIFeesData] = useState([]);
  const [filteredIFees, setFilteredIFees] = useState([]); // State for filtered data
  const [selectedDatabase, setSelectedDatabase] = useState("Denver");
  const [selectedMembershipType, setselectedMembershipType] = useState("A");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [descriptionManuallyEdited, setDescriptionManuallyEdited] =
    useState(false); // Track if description was manually changed
  const [startDate, setStartDate] = useState(""); // State for start_date input
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const tableRef = useRef(null);

  // Fetch data on component mount and when database changes
  useEffect(() => {
    const fetchIFeesData = async () => {
      try {
        const response = await fetch(
          `http://vwbwebdev:9090/IFees?database=${selectedDatabase}`
        );
        const data = await response.json();
        console.log("Fetched data:", data); // Check data format
        setIFeesData(data);
        setFilteredIFees(data); // Initialize filtered data to full data
      } catch (error) {
        console.error("Error fetching IFees data:", error);
      }
    };

    fetchIFeesData();
  }, [selectedDatabase]); // Depend on selectedDatabase

  /* 
#
FUNCTIONS ################################################################################################################
#
#
*/

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
    setShowModal(true); // Show the modal when submit is clicked
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
  const handleConfirm = () => {
    setShowModal(false);
    // Add the code for processing form submission here, e.g., sending data to the server
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

    // Ensure end date is after the start date
    if (startDate && value <= startDate) {
      setEndDateError("End Date must be after Start Date.");
    } else {
      setEndDateError(""); // Clear error if valid
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

        {/* Title for the new section */}
        <h3>Enter New Enrollment Fee</h3>

        <form onSubmit={handleSubmit}>
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
            min={startDate} // Ensure the date picker doesn't allow dates before the start date
          />
          {endDateError && <p className={styles.errorMsg}>{endDateError}</p>}

          <label htmlFor="membership_type">Membership Type:</label>
          <select
            id="membership-select"
            value={selectedMembershipType}
            onChange={(e) => setselectedMembershipType(e.target.value)}
            className={styles.dropdown}
          >
            <option value="A">All Membership Types</option>
            <option value="I">Individual</option>
            <option value="D">Couple</option>
            <option value="F">Family</option>
          </select>

          {/* Submit button */}
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
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
        <div className={styles.top}>
          <Search placeholder="Search ifees..." onSearch={handleSearch} />
        </div>
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
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

      {/*
#
# POPUP MODAL  ################################################################################################################
# #
*/}
      {/* Modal for confirmation */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>
              Please confirm you want to enter this new initiation enrollment
              fee:
            </h3>
            <p>Database: {selectedDatabase}</p>
            <p>Description: {description}</p>
            <p>Price: ${price}</p>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
            <p>Membership Type: {selectedMembershipType}</p>
            <div className={styles.modalButtons}>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                Confirm
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IFeesPage;
