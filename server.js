// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const cors = require('cors');
const SocketManager = require('./server/helpers/socketManager');
const config = require('./server/config.json');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

//enable CORS
app.use(cors());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  getToken: function (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
          return req.query.token;
      }
      return null;
  }
}).unless({ path: [/^(?!.*(\/api))/gi,'/api/users/authenticate','/api/users/register',]}));

//catch authentication error              
app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message});
      return;
    }
 next();
});

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
}); 

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

//pass server to socketManger
const socketManager = new SocketManager(server);

//connect to db
const mongoDbUri = process.env.DBURI || config.connectionString;
mongoose.connect(mongoDbUri);
db = mongoose.connection;
db.on('error',function(){
  //console.error.bind(console, 'connection error:');
  console.log('Error connecting to '  + mongoDbUri);
  console.log('Application cannot be started. Exiting Now.');
  process.exit(1);
});
db.once('open',function(){
    console.log('Connected to ' + mongoDbUri);
})

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on Port ${port}/api`));
