var express = require('express');
var app = express();
var server = require('http').createServer(app);
var data = require('./data');
var _ = require('underscore');
var analyzed = _.sortBy(require('./analyzed'), function (a) { return a.id; });

var spawn = require('child_process').spawn;

app.configure(function () {
   app.set('port', process.env.PORT || 3000);
   app.use(function(req, res, next){
     console.log('%s %s', req.method, req.url);
     next();
   });
   app.use(express.bodyParser());
});

server.listen(app.get('port'));

app.get('/movies', function (req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(200, data.movies);
});

app.post('/analyze', function (req, res) {
   var movie = req.body;
   var synopsis = movie.synopsis;
   console.log('Received ', movie, ' for analysis');

   if (!synopsis) {
      return res.send(400, 'Synopsis is required.');
   }

   // You must send a movie from the training data and its synopsis
   var actualMovie = _.find(data.movies, function (m) {
      return m.id == movie.id && m.synopsis.trim().toLowerCase() == synopsis.trim().toLowerCase();
   });

   if (!actualMovie) {
      return res.send(400, 'Invalid synopsis or movie does not exist.');
   }

   var analysis = _.find(analyzed, function (a) {
      return a.id == movie.id;
   });

   if (analysis) {
      return res.send(200, analysis.named_entities);
   } 
   else {
      return res.send(404, 'Movie does not exist in training set.');
   }
});

var PROVIDE_CORRECT_FORMAT = 'You must provide an array of objects with id and named_entities. Example [{ "id": "1234", "named_entities": ["Joe"] }]';
var NO_DATA_PROVIDED = 'No data provided.';
var PROVIDE_ALL_DATA = 'Provide all analyzed data.';

// Expects an array of movie ids and their named entities
app.post('/check', function (req, res) {
   var answer = req.body;

   if (!answer) {
      return res.send(200, { 'results': [NO_DATA_PROVIDED, PROVIDE_CORRECT_FORMAT] });
   }
   var isArray = (answer instanceof Array);
   var hasExactKeys = _.every(answer, function (a) { return _.difference(_.keys(a), ['id', 'named_entities']).length == 0; });
   var neIsArray = _.every(answer, function (a) { return a.named_entities instanceof Array; });

   if (!isArray) {
      return res.send(200, { 'resuts': [ PROVIDE_CORRECT_FORMAT, 'Answers is not an array.' ]});
   } 

   if (!hasExactKeys) {
     return res.send(200, { 'resuts': [ PROVIDE_CORRECT_FORMAT, 'The objects in answer array do not match expected format.' ]}); 
   }

   if (!neIsArray) {
     return res.send(200, { 'resuts': [ PROVIDE_CORRECT_FORMAT, 'The named entities must be an array' ]}); 
   }

   if (answer.length != analyzed.length) {
      return res.send(200, { 'results': [PROVIDE_ALL_DATA, PROVIDE_CORRECT_FORMAT] })
   }

   var sorted = _.sortBy(answer, function (a) {
      return a.id;
   });
   
   var toCheck = _.zip(analyzed, sorted);
   for (var i = 0, length = toCheck.length; i < length; i++) {
      var actual = toCheck[i][0];
      var theirs = toCheck[i][1];

      if (_.difference(actual.named_entities, theirs.named_entities).length > 0) {
         return res.send(200, { results: [ 'Invalid set of named entities for movie id ' + actual.id ] });
      }
   }
   return res.send(200, 'Perfect! Good job!');
});

console.log('Server listening on port ' + app.get('port'));