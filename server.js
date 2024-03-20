const http = require('http');
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT; // Set a default port if process.env.PORT is not defined
const db = require('./models')
const Routes = require('./routes/route')
db.sequelize.sync()
const server = http.createServer(app) // Use http.createServer instead of require('http').createServer
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transport: ['websocket'],
  multiplex: false,
  path: '/api/socket.io'
});

app.use(cors())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (request, response, next) {
  request.io = io
  next()
})
app.use('/api', Routes)
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed. Shutting down gracefully...')
    process.exit(0)
  })
})
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});