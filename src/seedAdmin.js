// seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "./models/adminModel.js";

dotenv.config({path:"../.env"});

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10); // choose strong password

    const admin = new Admin({
      username: "Akash@01",
      name: "Akash Tiwari",
      email: "akash31902@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await admin.save();
    console.log(" Superadmin created successfully");
    process.exit();
  } catch (err) {
    console.error(" Error seeding superadmin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
