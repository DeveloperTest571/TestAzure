const db = require('../../models')
const users = db.user
module.exports = {
    viewUser: function (req, res) {
        const resData = {
          status: false,
          data: [],
          message: ''
        }
        users.findAll({
            where: {
              status: 1
            },
            
          }).then(function (result) {
            resData.status = true
            resData.data = result
            resData.message = "User Listed Successfully"
            res.status(200).json(resData)
          }).catch(function (err) {
            console.log(err)
            resData.message = 'Please try again'
            res.status(200).json(resData)
          })
    }
}