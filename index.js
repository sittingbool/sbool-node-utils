/**
 * Created by richardhabermann on 18.06.15.
 */

var available = {
    dateUtil: '/util/dateutil',
    stringUtil: '/util/string',
    objectUtil: '/util/objectUtil',
    typesUtil: '/util/types',
    promisesUtil: '/util/promises',
    fileLogger: '/util/fileLogger'
};

module.exports = require('./lib/lazyRequire')(available, __dirname);
