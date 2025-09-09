const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posters",
    allowed_formats: ["jpg"],
    format: async (req, file) => "jpg",
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `${timestamp}`;
    },
  },
});

const upload = multer({ storage });

module.exports = upload;
