const db = require('../../models')
const users = db.user
const fs = require('fs');
const path = require('path');
module.exports = {
    dropUser: function (req, res) {
        const resData = {
          status: false,
          data: [],
          message: ''
        }
        if (!req.body.email) {
            resData.message = "Please enter email to find the user"
            return res.status(400).json(resData);
          }
          const email = req.body.email || "";
          users.findAll({
            where: {
              email: email
            }
          }).then(function (result) {
              if (result.length === 0) {
                  resData.message = "No user found";
                  return res.status(404).json(resData);
              }
              if(result[0].dataValues.id){
                dropUserDetails(result[0].dataValues)
              }
          }).catch(function (err) {
              console.log(err);
              resData.message = 'Please try again';
              res.status(500).json(resData);
          });
          function dropUserDetails(user){
            users.destroy({
                where: {
                  id: user.id
                }
            }).then(function (result) {
                if (result === 1) {
                  const userFolder = path.join(__dirname, '../../uploads', user.name);
                  fs.promises.rmdir(userFolder, { recursive: true })
                    .then(() => {
                      resData.status = true;
                      resData.message = "User and associated folder deleted successfully";
                      res.status(200).json(resData);
                    })
                    .catch((err) => {
                      console.error('Error deleting user folder:', err);
                      resData.message = 'User deleted, but error occurred deleting folder';
                      res.status(500).json(resData);
                    });
                 
                } else {
                  resData.status = false;
                  resData.message = "User not found";
                  res.status(200).json(resData);
                }
            }).catch(err => {
                resData.message = err.message;
                res.status(500).json(resData);
            });
            
          }
    }

}