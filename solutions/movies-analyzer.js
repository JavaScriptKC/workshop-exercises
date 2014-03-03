var http = require('http');

var getMovies = function (cb) {
   var request = http.request({
      method: 'GET',
      host: 'localhost',
      port: '3000',
      path: '/movies'
   }, function (res) {
      var result = '';

      res.on('data', function (data) {
         result += data.toString();
      });

      res.on('end', function () {
         // Now we have a set of movies
         cb(JSON.parse(result));
      });
   });

   request.end();
};

var analyzeAllMovies = function (movies, cb) {
   // Now analyze each movie
   var results = [];

   movies.forEach(function (m) {
      var req = http.request({
         method: 'POST',
         host: 'localhost',
         port: '3000',
         path: '/analyze',
         headers: { 'Content-Type': 'application/json' }
      }, function (res) {
         var result = '';

         res.on('data', function (data) {
            result += data.toString();
         });

         res.on('end', function () {
            results.push({
               id: m.id,
               named_entities: JSON.parse(result)
            });

            if (results.length == movies.length) {
               cb(results);               
            }
         });

      });

      req.end(JSON.stringify({
         id: m.id,
         synopsis: m.synopsis
      }));
   });
};

getMovies(function (movies) {
   analyzeAllMovies(movies, function (analyzed) {
      var req = http.request({
         method: 'POST',
         host: 'localhost',
         port: '3000',
         path: '/check',
         headers: { 'Content-Type': 'application/json' }
      }, function (res) {
         res.pipe(process.stdout);
      });

      req.end(JSON.stringify(analyzed));
   });
});