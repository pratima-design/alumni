const asyncHandler = require("express-async-handler");
const User = require("../models/User");

exports.list = asyncHandler(async (req, res) => {
  const { search, role, batchYear, department, location, designation, approved } = req.query;
  const q = {};
  if (role) q.role = role;
  if (batchYear) q.batchYear = Number(batchYear);
  if (department) q.department = new RegExp(`^${department}$`, "i");
  if (location) q.location = new RegExp(location, "i");
  if (designation) q.designation = new RegExp(designation, "i");
  if (approved === "true") q.isApproved = true;
  if (approved === "false") q.isApproved = false;

  if (req.user.role === "faculty") {
    q.department = new RegExp(`^${req.user.department}$`, "i");
  }

  if (search) q.$or = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
    { designation: new RegExp(search, "i") },
    { location: new RegExp(search, "i") },
    { rollNo: new RegExp(search, "i") },
  ];
  const users = await User.find(q).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json(user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updatableFields = ["name", "designation", "batchYear", "program", "gender",
    "department", "about", "address", "location", "socialLinks"];

  updatableFields.forEach((f) => {
    if (req.body[f] !== undefined && req.body[f] !== null) {
      req.user[f] = req.body[f];
    }
  });

  if (req.body.password && req.body.password.length >= 6) {
    req.user.password = req.body.password;
  }

  try {
    await req.user.save();
    const fresh = await User.findById(req.user._id).select("-password");
    res.json(fresh);
  } catch (error) {
    console.error("UpdateMe error:", error.message);
    res.status(400);
    throw new Error(error.message || "Failed to update user");
  }
});

exports.adminUpdateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["admin", "faculty", "alumni", "student"].includes(role)) {
    res.status(400); throw new Error("Invalid role");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  res.json(user);
});

exports.adminDelete = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

exports.updateMyPhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  if (!photo) {
    res.status(400);
    throw new Error("Photo URL is required");
  }
  req.user.photo = photo;
  await req.user.save();
  res.json(await User.findById(req.user._id).select("-password"));
});

exports.approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user.role === "faculty") {
    if (user.role === "faculty" || user.role === "admin") {
      res.status(403);
      throw new Error("Faculty cannot approve this role");
    }
    if (user.department !== req.user.department) {
      res.status(403);
      throw new Error("Faculty can approve only users in their department");
    }
  } else if (req.user.role === "admin") {
    // admin can approve anyone
  } else {
    res.status(403);
    throw new Error("Forbidden");
  }

  user.isApproved = true;
  user.approvedBy = req.user._id;
  await user.save();
  res.json(await User.findById(user._id).select("-password"));
});

exports.facultyCreateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = "student", program, batchYear, gender } = req.body;
  if (req.user.role !== "faculty") {
    res.status(403);
    throw new Error("Only faculty can add users");
  }
  if (!name || !email || !phone || !password || !program || !batchYear) {
    res.status(400);
    throw new Error("Missing required fields");
  }
  if (!["student", "alumni"].includes(role)) {
    res.status(400);
    throw new Error("Faculty can only create student/alumni users");
  }
  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) {
    res.status(400);
    throw new Error("Email or phone already in use");
  }
  const created = await User.create({
    name,
    email,
    phone,
    password,
    role,
    program,
    department: req.user.department,
    batchYear: Number(batchYear),
    gender: gender || "prefer_not_to_say",
    isApproved: true,
    approvedBy: req.user._id,
  });
  res.status(201).json(await User.findById(created._id).select("-password"));
});

exports.searchMembers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json([]);
  }
  const regex = new RegExp(q.trim(), "i");
  const users = await User.find({
    isApproved: true,
    $or: [{ name: regex }, { rollNo: regex }],
  }).select("_id name photo role department rollNo program").limit(10);
  res.json(users);
});

exports.facultyDeleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "faculty") {
    res.status(403);
    throw new Error("Only faculty can remove users");
  }
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error("User not found");
  }
  if (target.department !== req.user.department || !["student", "alumni"].includes(target.role)) {
    res.status(403);
    throw new Error("Faculty can remove only student/alumni users from their department");
  }
  await target.deleteOne();
  res.json({ message: "Deleted" });
});
