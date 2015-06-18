/**
 * Created by richardhabermann on 10.03.15.
 */
exports.isObject = function( value) {
    return ( typeof value === 'object' );
};

exports.isValidObject = function( value) {
    return ( exports.isObject( value) && value !== null );
};
