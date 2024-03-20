const db = require('../../models');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const users = db.user;
const bcrypt = require('bcrypt')
const connect = require('../../config/database')
module.exports = {
  uploadUser: function (req, res) {
    const resData = {
      status: false,
      data: [],
      message: '',
    };
      const parsedData = [];
      try {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => parsedData.push(row))
          .on('end', async () => {
            try {
              parsedData.sort((a, b) => {
                return a.email.localeCompare(b.email);
              });
              for (let i=0; i<parsedData.length;i++){
                const sql = 'SELECT * FROM users WHERE users.email = ?'
                connect.query(sql,[parsedData[i].email], function (err, userRes) {
                  if (err) {
                    console.log('ERROR')
                    console.log(err)
                    throw err
                  }
                  
                  if (userRes.length > 0) {
                    console.log('User already exists::'+parsedData[i].email)
                    return
                  }else{
                    bcrypt.hash(parsedData[i].password, 10, function (err, hash) {
                      let password = hash
                      parsedData[i].password=password
                      users.create(parsedData[i]).then((result) => {
                        if(result.id){
                          const userFolder = path.join(__dirname, '../../uploads', result.name.toString()+'-'+result.id);
                          fs.mkdir(userFolder, { recursive: true }, (err) => {
                          if (err) {
                            console.error('Error creating user folder:', err);
                          } else {
                            console.log(`User folder created: ${userFolder}`);
                          }
                          });
                        }
                        
                      })
                        .catch((err) => {
                          resData.message = 'Users not created please try again'
                          res.status(200).json(resData)
                          throw err
                        })
                    })
                  }
                });
              }
            } catch (error) {
              console.error('Error inserting user data:', error);
              return { success: false, errors: [error.message] };
            }
          });
      } catch (error) {
        console.error('Error reading CSV file:', error);
        return { success: false, errors: [error.message] };
      }
      resData.status = true;
      resData.data = parsedData
      resData.message = "User Data Imported Successfully";
      res.status(200).json(resData);
  },
  getSample: function (req, res) {
    const resData = {
      status: false,
      data: [],
      message: '',
    };
    const sampleFilePath = path.join(__dirname, '../../uploads/import-sample', 'Sample_import_Document.csv');
    fs.exists(sampleFilePath, (exists) => {
      if (exists) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Sample_import_Document.csv');
        fs.createReadStream(sampleFilePath)
          .pipe(res)
          .on('error', (err) => {
            console.error('Error streaming file:', err);
            res.status(500).send('Error downloading file');
          });
          resData.status = true;
          resData.message = "Sample file downloaded Successfully";
          res.status(200).json(resData);
      } else {
        res.status(404).send('Sample file not found');
      }
    });
  }
};
