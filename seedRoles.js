// seedRoles.js
const mongoose = require("mongoose");
const Role = require("./models/role"); // Adjust the path to your Role model
const connectDB = require("./config/db"); // Adjust the path to your database connection

// Array of roles to seed
const roles = [
  { name: "admin" },
  { name: "procurement_manager" },
  { name: "inspection_manager" },
  { name: "client" },
];

// Seed function
async function seedRoles() {
  try {
    await connectDB(); // Connect to the database

    for (const roleData of roles) {
      const roleExists = await Role.findOne({ name: roleData.name });
      if (!roleExists) {
        await Role.create(roleData);
        console.log(`Role "${roleData.name}" created`);
      } else {
        console.log(`Role "${roleData.name}" already exists`);
      }
    }

    console.log("Seeding complete.");
    process.exit(); // Exit the process
  } catch (error) {
    console.error("Error seeding roles:", error);
    process.exit(1); // Exit with failure code
  }
}

// Run the seed function
seedRoles();
