const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendEmail } = require("../utils/email");

const ALLOWED_ROLES = ["student", "alumni", "faculty"];

exports.register = asyncHandler(async (req, res) => {
  const {
    name, email, phone, password, role,
    program, department, batchYear, gender,
  } = req.body;

  // Common required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const requestedRole = typeof role === "string" ? role.toLowerCase() : "student";

  // Role-specific validation
  if (requestedRole === "admin") {
    // Admin registers with email + password only (no phone/dept needed beyond defaults)
    // handled below
  } else if (requestedRole === "faculty" || requestedRole === "alumni") {
    if (!phone || !department) {
      res.status(400);
      throw new Error("Phone and department are required for " + requestedRole + " registration");
    }
  } else {
    // student
    if (!phone || !department || !program) {
      res.status(400);
      throw new Error("Phone, department, and program are required for student registration");
    }
  }

  // batchYear validation (only if provided)
  let parsedBatchYear;
  if (batchYear) {
    parsedBatchYear = Number(batchYear);
    if (Number.isNaN(parsedBatchYear) || parsedBatchYear < 1950 || parsedBatchYear > 2100) {
      res.status(400);
      throw new Error("Batch year must be between 1950 and 2100");
    }
  }

  const exists = await User.findOne({
    $or: phone
      ? [{ email }, { phone }]
      : [{ email }],
  });
  if (exists) {
    res.status(400);
    throw new Error("Email or phone already in use");
  }

  const count = await User.countDocuments();

  if (requestedRole === "admin" && count > 0) {
    res.status(403);
    throw new Error("Admin registration is restricted to the first user");
  }

  const desiredRole = ALLOWED_ROLES.includes(requestedRole) ? requestedRole : "student";
  const finalRole = count === 0 ? "admin" : desiredRole;

  const user = await User.create({
    name,
    email,
    phone: phone || "",
    password,
    role: finalRole,
    program: program || "",
    rollNo: req.body.rollNo || "",
    department: department || "N/A",
    ...(parsedBatchYear ? { batchYear: parsedBatchYear } : {}),
    gender: gender || "prefer_not_to_say",
    isApproved: count === 0 ? true : false,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    ...(user.isApproved
      ? { token: generateToken(user._id) }
      : { message: "Registration submitted. Awaiting admin approval." }),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // If a role hint is provided, validate it matches
  if (role && user.role !== role) {
    res.status(403);
    throw new Error(`This account belongs to the '${user.role}' role. Please use the correct login page.`);
  }

  if (!user.isApproved) {
    res.status(403);
    throw new Error("Your account is pending admin approval");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    department: user.department,
    program: user.program,
    batchYear: user.batchYear,
    gender: user.gender,
    isApproved: user.isApproved,
    token: generateToken(user._id),
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If this email exists, a password reset link has been sent" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  const resetUrl = `${clientOrigin}/reset-password?token=${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your AlumniConnect password",
      text: `Reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`,
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError.message);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error("Failed to send reset email. Please check your email configuration and try again.");
  }
  res.json({ message: "Password reset link has been sent to email..." });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 6) {
    res.status(400);
    throw new Error("Token and password (min 6 chars) are required");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }
  user.password = password;
  user.resetPasswordToken = "";
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
});
