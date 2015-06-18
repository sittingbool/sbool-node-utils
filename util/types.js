/**
 * Created by richardhabermann on 11.03.15.
 */
var objectUtil = require('./objectUtil');
var stringUtil = require('./string');

exports.isValidId = function isValidId( value) {
    return ( exports.isFiniteNumber( value) && value >= 0 );
};
exports.isFiniteNumber = function isFiniteNumber( value) {
    return ( typeof value === 'number' && Number.isFinite(value) );
};
exports.isValidObject = function isValidObject( value) {
    return objectUtil.isValidObject( value);
};
exports.isObject = function isObject( value) {
    return objectUtil.isObject( value);
};
exports.isArray = function isArray( value) {
    return ( value instanceof Array );
};
exports.arrayIsEmpty = function arrayIsEmpty( value) {
    return ( !exports.isArray( value) || value.length < 1 );
};
exports.isString = function isString( value) {
    return ( typeof value === 'string' );
};
exports.stringIsEmpty = function stringIsEmpty( value) {
    return ( !exports.isString( value) || stringUtil.stringIsEmpty( value) );
};


exports.valueIsNotIn = function valueIsNotIn( value, compArray) {
    var i, current;

    if ( exports.arrayIsEmpty(compArray) ) {
        return true;
    }

    for ( i = 0; i < compArray.length; i++ ) {
        current = compArray[i];
        if ( current === value ) {
            return false;
        }
    }

    return true;
};

exports.htmlSpecialCharsToUTF8 = function htmlSpecialCharsToUTF8( string) {

    var map, matches;

    if ( !exports.isString(string) ) {
        return string;
    }

    matches = string.match(/&(#[xX])?([a-zA-z0-9]+);/g);

    if ( matches === null || matches instanceof Array === false || matches.length < 1 ) {
        return string;
    }

    map = require('./htmlSpecialCharMapping.json');

    return string.replace(/&(#[xX])?([a-zA-z0-9]+);/g, function(m) { return map[m]; });
};
