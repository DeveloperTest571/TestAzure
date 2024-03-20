const db = require('../../models');
const users = db.user;
const fs = require('fs');
const path = require('path');

module.exports = {
  uploadBill: async function (req, res) {
    const resData = {
      status: false,
      data: [],
      message: '',
    };

    try {
      const user = await users.findOne({ where: { email: req.body.email } });

      if (!user) {
        resData.message = 'User not found';
        return res.status(404).json(resData);
      }

      const year = req.body.year;
      const month = req.body.month;

      const userFolder = path.join(
        __dirname,
        '../../uploads',
        user.name + '-' + user.id,
        year,
        month
      );
      try {
        await fs.promises.mkdir(userFolder, { recursive: true });
      } catch (err) {
        console.error('Error creating user folder:', err);
        resData.message = 'Error uploading bill (folder creation failed)';
        return res.status(500).json(resData);
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        resData.message = 'No file uploaded';
        return res.status(400).json(resData);
      }

      const sourcePath = path.join(__dirname, '../../uploads/import-user', uploadedFile.filename);
      try {
        await fs.promises.access(sourcePath, fs.constants.F_OK);
      } catch (err) {
        console.error('Source file not found:', sourcePath);
        resData.message = 'Error uploading bill (source file missing)';
        return res.status(500).json(resData);
      }

      const targetPath = path.join(userFolder, uploadedFile.filename);

      await fs.promises.rename(sourcePath, targetPath);

      resData.status = true;
      resData.data = { filename: uploadedFile.filename };
      resData.message = 'Bill uploaded successfully';
      res.status(200).json(resData);
    } catch (err) {
      console.error('Error uploading bill:', err);
      resData.message = 'Error uploading bill';
      res.status(500).json(resData);
    }
  },
};
