require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Post = require("../models/Post");
const Announcement = require("../models/Announcement");

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Post.deleteMany(), Announcement.deleteMany()]);

  const admin = await User.create({
    name: "Admin User", email: "admin@example.com", phone: "1000000001",
    password: "password", role: "admin", department: "Administration",
  });
  const alum = await User.create({
    name: "Alumni Anna", email: "alumni@example.com", phone: "1000000002",
    password: "password", role: "alumni", batchYear: 2018, department: "Computer Science",
    designation: "Senior Engineer at TechCo",
  });
  const student = await User.create({
    name: "Student Sam", email: "student@example.com", phone: "1000000003",
    password: "password", role: "student", batchYear: 2026, department: "Computer Science",
  });

  await Post.create({
    author: alum._id,
    content: "Welcome to the alumni network! Excited to reconnect with everyone.",
  });

  await Announcement.create({
    title: "Annual Reunion 2025",
    description: "Save the date — December 15th. RSVP via the portal.",
    author: admin._id,
  });

  console.log("Seed complete. Logins (password = 'password'):");
  console.log(" admin@example.com / alumni@example.com / student@example.com");
  await mongoose.disconnect();
  process.exit(0);
})();
