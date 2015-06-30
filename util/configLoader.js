/**
 * Created by richardhabermann on 28.06.15.
 */

var path = require('path');
//var stringUtil = require('../util/string');
var jsonFile = require('jsonfile');
var fs = require('fs');

/**
 * Loads config file with many options
 *
 * @param configDir - directory which should be used for
 * @param options - object that can take following parameters:
 *
 * configEnvironmentVar: key that is used on process.env[<key>] to use it as oath to config directory
 * subDirPath: path within the directory loaded over configEnvironmentVar
 * fileToBeLoaded: name of the file that should be found
 * altDirNameKey: if directory has an index.js we will require it and use this key to get get the path for the subdirectory
 * altFileNameKey: if directory has an index.js we will require it and use this key to get get the file name that should be loaded
 * defaultFilePath: path to fallback file
 */

var isFile = function( path) {

    var stat = null;

    try {
        stat = fs.statSync( path );
    } catch (err) {
        console.log(err);
    }

    return ( stat && stat.isFile() );
};

module.exports = function( configDirFb, options) {

    var configDir = process.env[options.configEnvironmentVar], defaultPath = options.defaultFilePath || null,
        configIndexFilePath, configIndex, altFileDir, confFile;

    if( configDir === 'undefined' || configDir === 'null' ) {
        configDir = configDirFb || null;
    }

    if( configDir ) {
        confFile = path.join(configDir, options.subDirPath || '', options.fileToBeLoaded);

        if ( isFile( confFile ) ) {
            return confFile;
        }

        configIndexFilePath = path.join(configDir, 'index.json');

        if ( isFile( configIndexFilePath ) ) {
            configIndex = jsonFile.readFileSync(configIndexFilePath);

            confFile = configIndex[options.altFileNameKey] || null;

            if ( confFile ) {
                confFile = path.join(configDir, confFile);
                if ( isFile(confFile)) {
                    return confFile;
                }
            }

            altFileDir = configIndex[options.altDirNameKey] || null;

            if ( altFileDir ) {
                confFile = path.join(configDir, altFileDir, options.fileToBeLoaded);

                if ( isFile( confFile ) ) {
                    return confFile;
                }
            }
        }
    } else {
        confFile = defaultPath;

        if ( isFile( confFile ) ) {
            return confFile;
        }
    }

    return null;
};
