const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads/import-user');
    fs.mkdir(uploadsDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating uploads directory:', err);
        cb(err);
        return;
      }
      cb(null, uploadsDir);
    });
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const uniqueSuffix = now.getFullYear()+now.getHours()+now.getMinutes();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = function (req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ message: 'Error uploading file' });
      return;
    }

    const uploadedFile = req.file;
    if (!uploadedFile) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    console.log('File uploaded successfully:', uploadedFile.path);
    res.status(200).json({ message: 'File uploaded successfully' });
    next();
  });
};
module.exports = upload;