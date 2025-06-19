// utils/uploadFile.js

const upload = require('./multer');
const multer = require('multer');

const handleFileUpload = (req, res, filename) => {
  return new Promise((resolve, reject) => {
    upload.single(filename)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Known Multer error (like file too big)
        return reject({
          status: 400,
          message: err.code === 'LIMIT_FILE_SIZE' ? req.t('File is too large. Max size is 2MB.') : err.message
        });
      } else if (err) {
        // Unknown error
        return reject({
          status: 400,
          message: req.t(err.message)
        });
      }
      // No error — success
      resolve();
    });
  });
};

module.exports = handleFileUpload;
