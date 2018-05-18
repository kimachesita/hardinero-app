// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const cors = require('cors');
const SocketIO = require('socket.io');
const config = require('./server/config.json');
const BedService = require('./server/services/bed.service');

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

//connect to io
const io = SocketIO(server);
io.on('connection',function(socket){
   console.log(`Socket ${socket.id} connected...`);
   socket.on('overwrite',function(data){
      console.log(`Report to ${data.device_key}:`);
      console.log(data);
   });
   socket.on('report',function(data){
     console.log(`Report from ${data.device_key}:`);
     
   });
   socket.on('disconnect',function(){
     console.log(`Socket ${socket.id} disconnected...`);
   })
});


//connect to db
const mongoDbUri = process.env.DBURI || config.connectionString;
mongoose.connect(config.connectionString);
db = mongoose.connection;
db.on('error',function(){
  //console.error.bind(console, 'connection error:');
  console.log('Error connecting to '  + mongoDbUri);
  console.log('Application cannot be started. Exiting Now.');
  process.exit(-1);
});
db.once('open',function(){
    console.log('Connected to ' + mongoDbUri);
})

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}/api`));
