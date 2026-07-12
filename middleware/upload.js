const multer = require("multer");
const path = require("path");

// Safe filename helper
const sanitizeFileName = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9.-_]/g, "-")
        .replace(/\s+/g, "-")
        .toLowerCase();
};

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products");
    },

    filename: function (req, file, cb) {
        const safeName = sanitizeFileName(file.originalname);
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;