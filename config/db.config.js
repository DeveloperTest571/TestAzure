const dotenv = require('dotenv')
dotenv.config()

const { VP_DB_HOST, VP_DB_USER, VP_DB_PASSWORD, VP_DB_DATABASE, VP_DB_PORT } = process.env

module.exports = {
  HOST: VP_DB_HOST,
  USER: VP_DB_USER,
  PASSWORD: VP_DB_PASSWORD,
  DB: VP_DB_DATABASE,
  PORT: VP_DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  }
}
