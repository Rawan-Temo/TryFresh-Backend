// Multer storage configuration

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public")); // Save files to the desired folder
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Multer file filter for validating image uploads
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const mimeType = allowedFileTypes.test(file.mimetype);
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error("Only .jpeg, .jpg, and .png file formats are allowed!"));
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
  fileFilter: fileFilter,
});

module.exports = { upload };
