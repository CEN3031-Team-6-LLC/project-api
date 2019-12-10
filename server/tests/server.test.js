/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: Unit test cases for endpoints and MongoDB ORM models.
 */

const should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('../config/express')
    config = process.env.NODE_ENV == "PROD" ? {} : require('../config/config');

var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema'),
    NuclideICRP = require('../models/NuclideICRP.schema');

const plumePayload = {
    "sourceAmount": 23,
    "windSpeed": 42,
    "receptorHeight": 50,
    "releaseHeight": 20,
    "stability": "a",
    "maxDistance": 1000,
    "distanceIncrement": 0.1,
    "isotop": "H-3",
    "nuclide": "H",
    "lungClass": "F",
    "unitSystem": "metric"
};

const firePayload = {
    "sourceAmount": 23,
    "fireCloudTop": 35,
    "windSpeed": 42,
    "receptorHeight": 50,
    "fireRadius": 2,
    "stability": "a",
    "maxDistance": 1000,
    "distanceIncrement": 1,
    "isotop": "H-3",
    "nuclide": "H",
    "lungClass": "F",
    "unitSystem": "metric"
};

describe('HotSpot app test', function() {

    this.timeout(10000);

    before(function(done) {
        mongoose.connect(
            process.env.DB_KEY || config.db.uri,
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
            .end(async function(err, res) {
                should.not.exist(err);
                should.exist(res);
                var count = await Nuclide.countDocuments({});
                res.body.should.have.length(count);
                done();
            });
    });

    it('it should return nuclide`s lung classes', function(done) {
        var isotop = (Nuclide.findOne({})).isotop;
        agent.get(`/api/nuclides/getNuclidesLungClasses/${isotop}`)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should return nuclide`s icrp lung class', function(done) {
        var nuclide = (Nuclide.findOne({})).nuclide;
        agent.get(`/api/nuclides/getNuclidesICRPLungClass/${nuclide}`)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should be able to calculate plume', function(done) {
        agent.post('/api/calculate/plume/')
            .send(plumePayload)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should be able to calculate fire', function(done) {
        agent.post('/api/calculate/fire/')
            .send(firePayload)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should be able to export plume', function(done) {
        agent.post('/api/export/plume/')
            .send(plumePayload)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should be able to export fire', function(done) {
        agent.post('/api/export/fire/')
            .send(firePayload)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                should.exist(res.body);
                done();
            });
    });

    it('it should fail calculation or export request if required fields are missing or malformed', function(done) {
        agent.post('/api/calculate/plume/')
            .send({})
            .expect(500)
            .end(function(err, res) {
                should.exist(res.error);
                should.exist(res.error.text);
                done();
            });
    });

    it('it should have some data in MongoDB', function(done) {
        var nuclide = Nuclide.findOne({});
        var nuclideDose = NuclideDoses.findOne({});
        var nuclideIcrp = NuclideICRP.findOne({});
        should.exist(nuclide);
        should.exist(nuclideDose);
        should.exist(nuclideIcrp);
        done();
    });

    after(function(done) {
        done();
    });

});