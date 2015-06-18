/**
 * Created by richardhabermann on 27.08.14.
 */
var md5 = require('MD5');

exports.stringIsEmpty = function stringIsEmpty( string) {
    if ( typeof string === undefined || string === undefined ) {
        return true;
    }
    return ( string === null || string === "null" || string.length < 1 );
};

exports.stringToBoolean = function stringToBoolean(string){
    switch(string.toLowerCase()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
};

exports.capitaliseFirstLetter= function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.isSameAsInt = function isSameAsInt( string) {
    if ( typeof string === 'number' ) { return true; }
    if ( typeof string !== 'string' ) { return false; }

    var int = parseInt(string);

    if ( ''+int === string ) { return true; }

    return false;
};

exports.makeAmazonPathName = function makeAmazonPathName( string) {
    if ( typeof string !== 'string' ) { return string; }

    return string.replace(/([^a-z0-9]+)/gi, '-');
};

exports.streamMetaTrackIdentifierForTrackArtistAndTitle =
    function streamMetaTrackIdentifierForTrackArtistAndTitle( artist, title)
    {
        var hash = '';

        hash += artist;
        hash += ' - ';
        hash += title;

        hash = md5(hash);

        return hash;
    };

exports.streamMetaTrackIdentifierForTrackObject = function streamMetaTrackIdentifierForTrackObject( object) {

    return exports.streamMetaTrackIdentifierForTrackArtistAndTitle(object.getArtist(), object.getTitle());
};

var lastMatchOfRegExInString = function lastMatchOfRegExInString( regex, string ) {

    var matches = string.match(regex), lastMatch;

    if ( matches instanceof Array === false || matches.length < 1 ) {
        return null;
    }

    lastMatch = matches[matches.length-1];

    return lastMatch;
};

exports.lastMatchOfRegExInString = lastMatchOfRegExInString;

exports.lastIndexOfRegExInString= function lastIndexOfRegExInString( regex, string ) {

    var lastMatch = lastMatchOfRegExInString( regex, string );

    if ( lastMatch === null ) {
        return -1;
    }

    return string.lastIndexOf(lastMatch);
};


/**
 * gets a string between to strings (chars) like getting type in [type] -> stringBetweenStrings('[type]', '[', ']') ===
 * 'type'
 * @param string - the input string
 * @param startLimiter - the start limiter that will not be returned
 * @param endLimiter - the end limiter that will not be returned
 * @param onlyLookForFirstEndLimiter - (optional) if set to true the first found index of the end limiter will be used
 * otherwise it will be the last index
 */
exports.stringBetweenStrings =
    function stringBetweenStrings( string, startLimiter, endLimiter, onlyLookForFirstEndLimiter ) {

    var endIndex, startIndex;

    if ( typeof string !== 'string' || exports.stringIsEmpty(string) ||
        typeof startLimiter !== 'string' || exports.stringIsEmpty(startLimiter) ||
        typeof endLimiter !== 'string' || exports.stringIsEmpty(endLimiter) ) {
        return string;
    }

    startIndex = string.indexOf(startLimiter);

    if ( startIndex < 0 ) {
        return '';
    }

    if ( onlyLookForFirstEndLimiter === true ) {
        endIndex = string.indexOf( endLimiter, startIndex+1 );
    } else {
        endIndex = string.lastIndexOf( endLimiter );
    }

    if ( endIndex < startIndex+1 ) {
        return '';
    }

    return string.substring(startIndex+1, endIndex);
};

