const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Check if all Cloudinary credentials are available
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✓ Cloudinary configured with cloud:", process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log("⚠ Cloudinary credentials not found, using local disk storage");
}

// Local disk storage configuration
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// Cloudinary storage configuration (only if credentials available)
let storage;
if (hasCloudinary) {
  try {
    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "alumni-app",
        resource_type: "auto",
      },
    });
  } catch (error) {
    console.error("Failed to initialize Cloudinary storage, falling back to disk storage:", error.message);
    storage = diskStorage;
  }
} else {
  storage = diskStorage;
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // Reject empty files
    if (file.size === 0) {
      return cb(new Error("File is empty"));
    }
    cb(null, true);
  },
});

module.exports = { upload, cloudinary, hasCloudinary };
