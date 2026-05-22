const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");
const { uploadFile } = require("../controllers/upload.controller");

// Wrap multer with error handling
const uploadWithErrorHandling = asyncHandler((req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      res.status(400);
      throw new Error(`Upload failed: ${err.message}`);
    }
    next();
  });
});

router.post("/", protect, uploadWithErrorHandling, uploadFile);

module.exports = router;
