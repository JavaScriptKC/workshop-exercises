var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.configure(function () {
   app.set('port', 3000);

   app.use(function(req, res, next){
     console.log('%s %s', req.method, req.url);
     next();
   });

   app.use(function (req, res, next) {

      if (req.url === '/auth') {
         return next();
      }

      if (req.headers['x-api-key'] !== 'abc123') {
         return res.send(401, 'Unauthorized');
      }

      return next();
   });

   app.use(express.bodyParser());
});

server.listen(app.get('port'));

app.get('/', function (req, res) {
   return res.send(200);  
});

app.post('/auth', function (req, res) {
   var credentials = req.body;
   if (credentials) {
      if (credentials.username === 'user' && credentials.password === 'password') {
         res.setHeader('Content-Type', 'application/json');
         return res.send({ token: 'abc123' });
      }
      else {
         res.send(401, 'Unauthorized')
      }
   }
   else {
      return res.send(401, 'Unauthorized');
   }
});

app.post('/transform', function (req, res) {
   var obj = req.body;
   var xout = req.query.xout;
   
   Object.keys(obj).forEach(function (k) {
      var result = obj[k];

      if (xout) {
         result = result.replace(new RegExp(xout, 'g'), 'X');
      }

      obj[k] = result.toUpperCase();
   });
   
   res.setHeader('Content-Type', 'application/json');
   res.send(200, obj);
});