const { Op } = require('sequelize')
const db = require('../../models')
const connect = require('../../config/database')
const bcrypt = require('bcrypt')
const users = db.user
module.exports = {
    updateUser: function (req, res) {
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
                updateUserDetails(result[0].dataValues.id)
              }
          }).catch(function (err) {
              console.log(err);
              resData.message = 'Please try again';
              res.status(500).json(resData);
          });
          function updateUserDetails(user_id){
            users.update({
                name:req.body.name,
              }, {
                where: {
                  id:user_id
                }
              }).then(function (result) {
                resData.status = true
                resData.message = "User updated successfully"
                res.status(200).json(resData)
              }).catch(err => {
                resData.message = err.message
                res.status(200).json(resData)
              })
            
          }
    }

}