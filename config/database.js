const dotenv = require('dotenv')
dotenv.config()
const mysql = require('mysql2')

const { VP_DB_HOST, VP_DB_USER, VP_DB_PASSWORD, VP_DB_DATABASE, VP_DB_PORT } = process.env

const connection = mysql.createConnection({
  host: VP_DB_HOST,
  user: VP_DB_USER,
  password: VP_DB_PASSWORD,
  database: VP_DB_DATABASE,
  port: VP_DB_PORT,
  multipleStatements: true
})

try {
  connection.connect(function (err) {
    if (err) throw err
  })
} catch (err) {
  console.error('Error connecting to database:', err)
}

module.exports = connection
