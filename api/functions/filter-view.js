const db = require('../../models')
const users = db.user
const { Op } = require('sequelize')
module.exports = {
    filterViewUser: function (req, res) {
        const resData = {
          status: false,
          data: [],
          message: ''
        }
      
        if (!req.body.email && !req.body.name) {
          resData.message = "Please enter email or name of the user"
          return res.status(400).json(resData);
        }
      
        const email = req.body.email || "";
        const name = req.body.name || "";
      
        users.findAll({
          where: {
            [Op.or]: [
              { email: email },
              { name: name }
            ]
          }
        }).then(function (result) {
            if (result.length === 0) {
                resData.message = "No user found";
                return res.status(404).json(resData);
            }
            resData.status = true;
            resData.data = result;
            resData.message = "User Listed Successfully";
            res.status(200).json(resData);
        }).catch(function (err) {
            console.log(err);
            resData.message = 'Please try again';
            res.status(500).json(resData);
        });
      }
}