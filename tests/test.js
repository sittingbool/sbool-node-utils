/**
 * Created by richardhabermann on 18.06.15.
 */
var mocha = require('mocha'),
    should = require('should'),
    supertest = require('supertest');

var nodeUtil = require('../index.js');

describe('Run Test', function () {
    it('should run', function (done) {

        done();
    });
});

describe('Require', function () {
    it('should require a module of choice', function (done) {

        var dateUtil = nodeUtil('dateUtil');
        var fileLogger = nodeUtil('fileLogger');
        var objectUtil = nodeUtil('objectUtil');
        var promisesUtil = nodeUtil('promisesUtil');
        var stringUtil = nodeUtil('stringUtil');
        var typesUtil = nodeUtil('typesUtil');

        dateUtil.should.be.an.Object;
        fileLogger.should.be.a.Function;
        objectUtil.should.be.an.Object;
        promisesUtil.should.be.an.Object;
        stringUtil.should.be.an.Object;
        typesUtil.should.be.an.Object;

        done();
    });

    it('should require all modules', function (done) {
        var all = nodeUtil('*');

        all.dateUtil.should.be.an.Object;
        all.fileLogger.should.be.a.Function;
        all.objectUtil.should.be.an.Object;
        all.promisesUtil.should.be.an.Object;
        all.stringUtil.should.be.an.Object;
        all.typesUtil.should.be.an.Object;

        done();
    });
});
