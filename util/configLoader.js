/**
 * Created by richardhabermann on 28.06.15.
 */

var path = require('path');
//var stringUtil = require('../util/string');
var jsonFile = require('jsonfile');
var fs = require('fs');

/**
 * Loads config from a json file with many options
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

module.exports = function( configDir, options) {

    var configDir = process.env.CONFIGDIR || null, defaultPath = options.defaultFilePath || null,
        configIndexFilePath, configIndex, altFileDir, confFile;

    if( configDir ) {
        // Try to load this from default config dir path where the given dir has a folder database
        // and a file modelScheme.json inside
        confFile = path.join(configDir, options.subDirPath || '', options.fileToBeLoaded);

        if ( isFile( confFile ) ) {
            return confFile;
        }

        // Alternatively look for index.json in config dir path and in this file for the key
        // "modelFile" to get the path for the model scheme relative to the config dir path
        configIndexFilePath = path.join(configDir, 'index.json');

        if ( isFile( configIndexFilePath ) ) {
            configIndex = jsonFile.readFileSync(configIndexFilePath);

            // check if file name is alterd
            confFile = configIndex[options.altFileNameKey] || null; // TODO: ch

            if ( confFile ) {
                confFile = path.join(configDir, confFile);
                if ( isFile(confFile)) {
                    return confFile;
                }
            }

            // check if folder name is altered
            altFileDir = configIndex[options.altDirNameKey] || null;

            if ( altFileDir ) {
                confFile = path.join(configDir, altFileDir, options.fileToBeLoaded);

                if ( isFile( confFile ) ) {
                    return confFile;
                }
            }
        }
    } else { // use backup files
        confFile = defaultPath;

        if ( isFile( confFile ) ) {
            return confFile;
        }
    }

    return null;
};