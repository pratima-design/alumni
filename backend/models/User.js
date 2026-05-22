const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const socialLinkSchema = new mongoose.Schema(
  { platform: String, url: String },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "faculty", "alumni", "student"], default: "student" },
    isApproved: { type: Boolean, default: false },
    photo: { type: String, default: "" },
    designation: { type: String, default: "" },
    // program & rollNo: required only for students (enforced in controller)
    program: { type: String, default: "", trim: true },
    rollNo: { type: String, default: "", trim: true },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"], default: "prefer_not_to_say" },
    batchYear: { type: Number, min: 1950, max: 2100 },
    department: { type: String, required: true, trim: true },
    about: { type: String, default: "" },
    address: { type: String, default: "" },
    location: { type: String, default: "" },
    socialLinks: [socialLinkSchema],
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.index({ name: "text", department: "text", designation: "text" });

module.exports = mongoose.model("User", userSchema);
