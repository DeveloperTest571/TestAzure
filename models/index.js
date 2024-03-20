const dbConfig = require('../config/db.config')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  port: dbConfig.PORT,

  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  },
  
  define: {
    paranoid: true
  },

  logging: false
})
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully!')
}).catch((err) => {
  console.log('Unable to connect to the database:', err)
})
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.model.js')(sequelize, Sequelize)
module.exports = db
