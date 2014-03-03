var spawn = require('child_process').spawn;

var initializeData = function (data) {
   var movies_analyzed = [];

   data.movies.forEach(function (m) {
      var cp = spawn('python', [process.cwd() + '/analyzer.py']);
      
      cp.stdin.write(m.synopsis);
      
      var results = '';
      
      cp.stdout.on('data', function (data) {
         results += data.toString();
      });
      
      cp.on('close', function () {
         movies_analyzed.push({
            id: m.id,
            title: m.title,
            named_entities: JSON.parse(results)
         });
         
         if (movies_analyzed.length == data.movies.length) {
            var ws = require('fs').createWriteStream('./analyzed.json');
            ws.write(JSON.stringify(movies_analyzed));
         }
      });

      //complete writing to stdin so child process will exit
      cp.stdin.end();
   });
};

initializeData(require('./data'));