/**
 * Created by richardhabermann on 18.06.15.
 */

var lazyRequire = require('./lib/lazyRequire');

var available = {
    dateUtil: '/util/dateutil',
    stringUtil: '/util/string',
    objectUtil: '/util/objectUtil',
    typesUtil: '/util/types',
    promisesUtil: '/util/promises',
    fileLogger: '/util/fileLogger',
    configLoader: '/util/configLoader',
    lazyRequire: lazyRequire
};

module.exports = lazyRequire(available, __dirname);
