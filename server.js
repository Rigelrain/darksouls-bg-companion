/**
* Module dependencies.
*/

import express from 'express'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import * as http from 'http'

const app = express()

/**
* Get port from environment and store in Express.
*/

var port = normalizePort('3000')
app.set('port', port)

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    // handing over to Express default error handler
    return next(err)
  }
  // logger.error(err);
  console.log(err)
  res.status(500).send(err.message)
}

/**
 * Routing
 */

app.use(express.static(path.join(__dirname, 'dist')))

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next()
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  }
})

// basic custom error handling, use in app.js
app.use(errorHandler)

/**
* Create HTTP server.
*/

var server = http.createServer(app)

/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on port ' + bind)
}
