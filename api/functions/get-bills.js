const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const db = require('../../models');
const users = db.user;

module.exports = {
  getBill: async function (req, res) {
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

      const year = req.body.year || '';
      const month = req.body.month || '';
      const userFolder = path.join(__dirname, '../../uploads', user.name + '-' + user.id, year, month);

      console.log('Path Check');
      console.log(userFolder);
      try {
        const stats = await fs.promises.stat(userFolder);
        if (!stats.isDirectory()) {
          resData.message = 'Bill folder not found';
          return res.status(404).json(resData);
        }
      } catch (err) {
        console.error('Error accessing user folder:', err);
        resData.message = 'Error accessing bill folder';
        return res.status(500).json(resData);
      }

      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive.on('error', (err) => {
        console.error('Error creating archive:', err);
        resData.message = 'Error creating bill archive';
        res.status(500).json(resData);
      });

      const outputFileName = `${user.name}-${year}-${month}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);

      archive.pipe(res);
      await archive.directory(userFolder, false);
      await archive.finalize();
    } catch (err) {
      console.error('Error exporting bill:', err);
      resData.message = 'Error exporting bill';
      res.status(500).json(resData);
    }
  },
};