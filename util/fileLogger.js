/**
 * Created by richardhabermann on 16.03.15.
 */
//----------------------------------------------------------------------------------------------------------
var __class = require("node-class").class,
    stringUtil = require('./string'),
    dateUtil = require('./dateutil'),
    path = require('path'),
    fs = require('fs');
//----------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------
var
    k_databaseLoaded = "databaseLoaded"
    ;
//----------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------
var FileLogger = __class( "FileLogger", {
//----------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------
    fileName: '',
    filePath: '',

    stream: null,
    //------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------
    initialize: function( fileName)
    //------------------------------------------------------------------------------------------------------
    {
        // if you want onEventName to work, send options to Events
        // otherwise send nothing
        // but you must call it or throws
        var logDir = path.join(path.dirname(require.main), 'logs');

        if (!fs.existsSync(logDir)){
            fs.mkdirSync(logDir);
        }

        this.fileName = fileName;

        this.filePath = path.join(logDir, fileName);

        this.stream = fs.createWriteStream(this.filePath, {flags : 'w'});
    },


    //------------------------------------------------------------------------------------------------------
    logMessage: function( message, caller, callback)
    //------------------------------------------------------------------------------------------------------
    {
        var calledBy = '', logMessage;

        if ( stringUtil.stringIsEmpty(message) ) { return; }

        if ( caller ) {
            calledBy = ' <'+caller+'> ';
        }

        logMessage = dateUtil.nowToString() + calledBy + ': ' +  message + '\n';

        this.stream.write(logMessage, 'utf8', callback);
    }
});


// SINGLETON
//----------------------------------------------------------------------------------------------------------
FileLogger.instances = {};
FileLogger.instance = null;

FileLogger.getLoggerInstance = function ( loggerName) {
    if( stringUtil.stringIsEmpty(loggerName) ) {
        if (this.instance === null ) {
            this.instance = new FileLogger('default.log');
        }
        return this.instance;
    }
    loggerName += '.log';
    if ( !this.instances.hasOwnProperty(loggerName) ) {
        this.instances[loggerName] = new FileLogger(loggerName);
    }
    return this.instances[loggerName];
};
//----------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------
module.exports = FileLogger;
//----------------------------------------------------------------------------------------------------------
