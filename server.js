var express = require('express');
var app = express();
var server = require('http').createServer(app);
var data = require('./data');
var spawn = require('child_process').spawn;

app.configure(function () {
   app.set('port', process.env.PORT || 3000);
   app.use(express.bodyParser());
});

server.listen(app.get('port'));

app.get('/movies', function () {
   res.setHeader('Content-Type', 'application/json');
   res.send(200, data);
});

app.post('/analyze'. function (req, res) {
   var movie = req.body;


});

var initializeData = function () {
   data.movies.forEach(function (m) {
      m.synopsis;
      spawn('python', [ __dirname + '/analyzer.py'])

   });
};


console.log('Server listening on port ' + app.get('port'));