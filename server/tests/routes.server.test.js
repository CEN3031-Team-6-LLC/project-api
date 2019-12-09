const should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('../config/express')
    config = require('../config/config');

describe('HotSpot app test', function() {

    this.timeout(10000);

    before(function(done) {
        mongoose.connect(
            config.db.uri,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        app = express.init();
        agent = request.agent(app);
        done();
    });

    it('it should be able to retrieve all nuclides', function(done) {
        agent.get('/api/nuclides/getNuclideList')
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                // res.body.should.have.length(834);
                done();
            });
    });

    // it('it should be able to retrieve all nuclides', function(done) {
    //     agent.get('/api/nuclides/getNuclideList')
    //         .expect(200)
    //         .end(function(err, res) {
    //             should.not.exist(err);
    //             should.exist(res);
                
    //             done();
    //         });
    // });

    after(function(done) {
        // process.exit(0);
        done();
    });

});