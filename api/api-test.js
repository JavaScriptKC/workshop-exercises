var supertest = require('supertest');
var api = supertest('http://localhost:3000');
var request = require('request');
var crypto = require('crypto');
var assert = require('assert');

describe('API', function () {
   it('should respond to / with unauthorized if there are no auth headers', function (done) {
      api.get('/')
         .expect(401)
         .end(done);
   });

   it('should allow to fetch an authentication token at /auth', function (done) {
      api.post('/auth')
         .expect(200)
         .expect('Content-Type', 'application/json')
         .expect({ token: 'abc123' })
         .send({ username: 'user', password: 'password' })
         .end(done);
   }); 

   it('should not allow tokens with bad auth values.', function (done) {
      api.post('/auth')
         .expect(401)
         .send({ username: 'u', password: 'p' })
         .end(done);
   }); 

   it('should respond to / with 200 when using the correct auth headers.', function (done) {
      api.get('/')
         .set('X-API-Key', 'abc123')
         .expect(200)
         .end(done);
   }); 

   it('should transform the values of a posted object to uppercase.', function (done) {
      api.post('/transform')
         .set('X-API-Key', 'abc123')
         .send({ test: 'abcdefghijk', test2: 'hello there' })
         .expect(200)
         .expect('Content-Type', 'application/json')
         .expect({ test: 'ABCDEFGHIJK', test2: 'HELLO THERE' })
         .end(done);   
   });

   it('should transform the values of a posted object to uppercase and replace the specified parameter xout with Xs.', function (done) {
      api.post('/transform?xout=f')
         .set('X-API-Key', 'abc123')
         .send({ test: 'abfcdefghijffk' })
         .expect(200)
         .expect('Content-Type', 'application/json')
         .expect({ test: 'ABXCDEXGHIJXXK' })
         .end(done);   
   });

   it('should not allow transform without api key', function (done) {
      api.post('/transform')
         .send({ test: 'abcdefghijk' })
         .expect(401)
         .end(done);   
   });

   it('should hash all data received using md5 algorithm', function (done) {
      var rs = new require('stream').Readable();
      var i = 0;
      var md5sum = crypto.createHash('md5');
      this.timeout(0);

      rs._read = function () {
         var val = String.fromCharCode(97 + Math.floor(Math.random() * 26));
         if (i++ < 10000) {
            md5sum.update(val);
            this.push(val);
         }
         else {
            this.push(null);
         }
      };

      var options = {
         url: 'http://localhost:3000/hash',
         headers: {
            'X-API-Key': 'abc123'
         }
      };

      rs.pipe(request.post(options, function (e, r, body) {
         assert.equal(JSON.parse(body).hash, md5sum.digest('hex'));
         done(e);
      }));
   });
});