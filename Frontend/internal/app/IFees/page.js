"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./IFees.module.css"; // Import the CSS module


const IFeesPage = () => {
  const [iFeesData, setIFeesData] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState("Denver");
  const [selectedMembershipType, setselectedMembershipType] = useState("A");
  const [price, setPrice] = useState(""); // State for price input
  const [priceError, setPriceError] = useState(""); // State for validation message
  const [endDate, setEndDate] = useState(""); // State for end_date input
  const [endDateError, setEndDateError] = useState(""); // State for end_date validation message
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchIFeesData = async () => {
      try {
        const response = await fetch("http://localhost:9090/IFees");
        const data = await response.json();
        setIFeesData(data);
      } catch (error) {
        console.error("Error fetching IFees data:", error);
      }
    };

    fetchIFeesData();
  }, []);

  // Function to dynamically adjust column widths based on content
  useEffect(() => {
    if (tableRef.current) {
      adjustColumnWidths();
    }
  }, [iFeesData]);

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
    // Find the index of the start of the current description group
    let groupStart = index;
    while (
      groupStart > 0 &&
      iFeesData[groupStart].description.trim() ===
        iFeesData[groupStart - 1].description.trim()
    ) {
      groupStart--;
    }

    // Calculate the group number to alternate the colors correctly
    const groupNumber = Math.floor(groupStart / 2);

    // Return the appropriate class based on the group number
    return groupNumber % 2 === 0 ? styles.White : styles.lightGoldenrodYellow;
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

  // Handle price change with validation
  const handlePriceChange = (e) => {
    let value = e.target.value;

    // Remove any $ symbol if present
    value = value.replace(/\$/g, "");

    // Validate that the value is a number or decimal less than 500
    if (!isNaN(value) && parseFloat(value) < 500) {
      setPrice(value);
      setPriceError(""); // Clear any error if valid
    } else {
      setPrice(value);
      setPriceError("Price must be a number or decimal less than $500");
    }
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle end_date change with validation
  const handleEndDateChange = (e) => {
    const value = e.target.value;
    const today = getTodayDate();

    setEndDate(value);

    // Validate that the end date is today or later
    if (value < today) {
      setEndDateError("End Date must be today or later.");
    } else {
      setEndDateError(""); // Clear error if valid
    }
  };

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

        <form>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            className={styles.formInput}
          />

          {/* Price input with $ sign */}
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

          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
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
          min={getTodayDate()} // Ensure the date picker doesn't allow past dates
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

          {/* Add submit/update buttons here */}
        </form>
      </div>

      {/* Right Pane: Table Display */}
      <div className={styles.rightPane}>
        <div className={styles.title}>
          Currently Active IFees (Enrollment) @ {selectedDatabase}
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
            {iFeesData.map((fee, index) => (
              <tr
                key={index}
                className={`${styles.tableRow} ${getRowClass(index)}`}
              >
                <td className={styles.tableCell}>{fee.description.trim()}</td>
                <td className={styles.tableCell}>{fee.price}</td>
                <td className={styles.tableCell}>{formatDate(fee.end_date)}</td>
                <td className={styles.tableCell}>
                  {fee.membership_type.trim()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IFeesPage;
