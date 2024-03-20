const { Op } = require('sequelize')
const db = require('../../models')
const connect = require('../../config/database')
const bcrypt = require('bcrypt')
const users = db.user
const fs = require('fs')
const path = require('path')
module.exports = {
    createUser: function (req, res) {
        const resData = {
          status: false,
          data: [],
          message: ''
        }
        if(!req.body.name){
          req.body.name = ''
        }
        if (!req.body.email) {
          resData.message = 'Email can not be blank'
          res.status(200).json(resData)
          return
        };
        const sql = 'SELECT * FROM users WHERE users.email = ?'
        connect.query(sql,[req.body.email], function (err, userRes) {
          if (err) {
            console.log('ERROR')
            console.log(err)
            resData.message = 'Please try again'
            res.status(200).json(resData)
            throw err
          }
          
          if (userRes.length > 0) {
            resData.status = true
            resData.data = userRes[0]
            resData.message = 'Email already exist'
            res.status(200).json(resData)
            return
          } else {
            passwordEncrypt()
          }
        })
      function passwordEncrypt () {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          const password = hash
  
          const val = {
            email: req.body.email,
            name: req.body.name,
            password,
            role: 3,
            status: 1,
            created_at: new Date()
          }
          users.create(val).then((result) => {
            if(result.id){
              const userFolder = path.join(__dirname, '../../uploads', result.name.toString()+'-'+result.id);
              fs.mkdir(userFolder, { recursive: true }, (err) => {
              if (err) {
                console.error('Error creating user folder:', err);
              } else {
                console.log(`User folder created: ${userFolder}`);
              }
              });
              resData.status=true
              resData.message="User created successfully"
              res.status(200).json(resData)
            }
            
          })
            .catch((err) => {
              resData.message = 'Users not created please try again'
              res.status(200).json(resData)
              throw err
            })
        })
      }
    }
}