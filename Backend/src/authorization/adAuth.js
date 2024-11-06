import ActiveDirectory from "activedirectory2";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/* // Log the loaded environment variables (sanitizing passwords)
console.log("Active Directory Config:");
console.log(`AD_URL: ${process.env.AD_URL}`);
console.log(`AD_BASE_DN: ${process.env.AD_BASE_DN}`);
console.log(`AD_USERNAME: ${process.env.AD_USERNAME}`);
// For security, do not log the password in production
console.log("AD_PASSWORD:", process.env.AD_PASSWORD);
console.log(`AD_PASSWORD: ${process.env.AD_PASSWORD ? "*****" : "Not Set"}`); */

// Updated Active Directory configuration using environment variables
const config = {
  url: process.env.AD_URL,
  baseDN: process.env.AD_BASE_DN,
  username: process.env.AD_USERNAME,
  password: process.env.AD_PASSWORD,
};

const ad = new ActiveDirectory(config);

// Function to authenticate user with Active Directory
export const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    ad.authenticate(username, password, (err, auth) => {
      if (err) {
        console.error("Authentication failed:", err);
        return reject(err);
      }
      if (auth) {
        console.log("Authenticated:", username);
        return resolve(true);
      } else {
        console.log("Authentication failed for:", username);
        return reject(new Error("Authentication failed"));
      }
    });
  });
};

// Function to check if user belongs to a specific group
export const isUserInGroup = (username, groupName) => {
  return new Promise((resolve, reject) => {
    const samAccountName = username.includes("\\")
      ? username.split("\\")[1]
      : username;

    console.log(
      `isUserInGroup: Checking membership for user ${samAccountName} in group ${groupName}`
    );

    // First, find the user to make sure they exist
    ad.findUser(samAccountName, (err, user) => {
      if (err) {
        console.error("Error finding user:", err);
        return reject(err);
      }
      if (!user) {
        console.error("User not found:", samAccountName);
        return reject(new Error(`User not found: ${samAccountName}`));
      }
      console.log("User found:", user);

      // Perform group membership check
      ad.isUserMemberOf(samAccountName, groupName, (err, isMember) => {
        if (err) {
          console.error("Group check failed:", err);
          return reject(err);
        }
        if (isMember) {
          console.log(`${samAccountName} is a member of group ${groupName}`);
          return resolve(true);
        } else {
          console.log(
            `${samAccountName} is not a member of group ${groupName}`
          );
          return resolve(false);
        }
      });
    });
  });
};

// Updated function to use specific group DN for IFees
export const isUserInIFeesGroup = async (username) => {
  const groupName = "CN=IFees,OU=Web,DC=corpnet,DC=com";

  try {
    console.log(
      `isUserInIFeesGroup: Checking membership for user ${username} in group ${groupName}`
    );

    const isMember = await isUserInGroup(username, groupName);
    return isMember;
  } catch (error) {
    console.error("Error checking group membership:", error);
    throw error;
  }
};
