/**
 * Created by richardhabermann on 18.06.15.
 */

var path = require('path');

module.exports = function lazyRequire( available, directory) {

    var allModules = null;

    if ( available === undefined ) {
        available = {};
    }

    if ( directory == undefined ) {
        directory = '.';
    }

    return function( which) {
        var key;

        if ( which === '*' ) {

            if ( allModules ) {
                return allModules;
            }

            allModules = {};

            for( key in available ) {
                if ( available.hasOwnProperty(key) ) {
                    allModules[key] = require(path.join(directory, available[key]));
                }
            }

            return allModules;
        }

        if ( typeof which !== 'string' || which.length < 1 || !available.hasOwnProperty(which) ) {
            return null;
        }

        return require(path.join(directory, available[which]));
    }
};
