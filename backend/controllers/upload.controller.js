const asyncHandler = require("express-async-handler");
const { hasCloudinary } = require("../config/cloudinary");

exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const uploadType = req.query.type || "post";
  if (!["profile", "post", "announcement"].includes(uploadType)) {
    res.status(400);
    throw new Error(`Invalid upload type: ${uploadType}`);
  }

  // Construct URL based on storage type
  let url;
  if (hasCloudinary && req.file.path) {
    // Cloudinary storage
    url = req.file.path;
  } else if (req.file.filename) {
    // Local disk storage
    url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else {
    res.status(500);
    throw new Error("Failed to determine file URL");
  }

  res.status(200).json({
    url,
    name: req.file.originalname,
    type: uploadType,
    size: req.file.size,
  });
});
