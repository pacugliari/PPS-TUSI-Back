const multer = require("multer");
const HttpError = require("../utils/http-error");

function createMulterMemory({ fileSizeMB = 10, fileCount = 3 } = {}) {
  const storage = multer.memoryStorage();
  const limits = {
    fileSize: fileSizeMB * 1024 * 1024,
    files: fileCount,
  };

  const fileFilter = (req, file, cb) => {
    if (!/^image\//i.test(file.mimetype)) {
      return cb(
        new HttpError(400, "Solo se permiten imágenes", [
          { error: "Solo se permiten imágenes" },
        ]),
        false
      );
    }
    cb(null, true);
  };

  return multer({ storage, limits, fileFilter });
}

module.exports = { createMulterMemory };
