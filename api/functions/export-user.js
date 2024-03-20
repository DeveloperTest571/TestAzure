const db = require('../../models')
const users = db.user
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
module.exports = {
    exportUser: function (req, res) {
        const resData = {
          status: false,
          data: [],
          message: '',
        };
      
        users.findAll({
          where: {
            status: 1,
          },
        }).then((result) => {
          if (result.length === 0) {
            resData.message = 'No users found';
            return res.status(404).json(resData);
          }
      
          // Generate CSV content
          let csvContent = '';
          csvContent += 'ID,Email,Name,Password,Role,Status,Created_At\n';
      
          result.forEach(user => {
            csvContent += `${user.id},${user.email},${user.name},${user.password},${user.role},${user.status},${user.created_at},\n`;
          });
      
          // Create a temporary file name
          const filename = `users-${Date.now()}.csv`;
          const filePath = path.join(__dirname, 'exports', filename);
      
          // Write CSV content to the temporary file (optional error handling)
          fs.writeFile(filePath, csvContent, (err) => {
            if (err) {
              console.error(err);
              resData.message = 'Error creating CSV file';
              return res.status(500).json(resData);
            }
      
            // Set response headers
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'text/csv');
            const fileStream = fs.createReadStream(filePath);
            fileStream.on('open', function () {
              fileStream.pipe(res);
            });
            fileStream.on('end', function () {
              fs.unlinkSync(filePath);
            });
          });
        }).catch((err) => {
          console.error(err);
          resData.message = 'Please try again';
          res.status(500).json(resData);
        });
    }
      
}