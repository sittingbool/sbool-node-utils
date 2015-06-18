/**
 * Created by richardhabermann on 30.04.15.
 */
var Q = require('q');

module.exports = {
    /**
     * Creates a promise that only returns an error to be used when promise is expected
     * but an error is already known and calls the callback if given
     * @param err - the error object or message as a string
     * @param callback - optional, a callback with signature function( error, result).
     * if given this one will be called despite returning a promise
     * @returns {*|promise} - the promise
     */
    promiseWithError: function promiseWithError( err, callback) {
        var deferred = Q.defer();
        if ( err instanceof Error ) {
            deferred.reject( err);
        } else {
            deferred.reject(new Error(err));
        }
        if ( typeof callback === 'function' ) {
            callback(err, null);
        }
        return deferred.promise;
    },

    /**
     * Creates a promise that only returns a result to be used when promise is expected
     * but the result is already known and calls the callback if given
     * @param result - the result value
     * @param callback - optional, a callback with signature function( error, result).
     * if given this one will be called despite returning a promise
     * @returns {*|promise} - the promise
     */
    promiseWithResult: function promiseWithError( result, callback) {
        var deferred = Q.defer();
        deferred.resolve(result);
        if ( typeof callback === 'function' ) {
            callback(null, result);
        }
        return deferred.promise;
    },

    /**
     * Returns a promise handling the function and taking a callback to state what to do with the deferred object
     * @param fun - the function to be executed
     * @param callback - the callback with signature function ( err, result, deferred)
     * @returns {*|promise} - the promise generated
     */
    promiseForCallback: function promiseForCallback( fun, callback) {
        var deferred = Q.defer();
        fun( function( error, result) {
            callback(error, result, deferred);
        });
        return deferred.promise;
    },

    /**
     * Returns a promise for a function that takes default callback ( signature function( error, result) ) as only parameter
     * @param fun - the function that takes default callback ( signature function( error, result) ) as only parameter
     * @returns {*|promise} - the promise
     */
    promiseForFunctionWithDefaultCallback: function promiseForFunctionWithDefaultCallback( fun) {
        return this.promiseForCallback( fun, function( error, result, deferred) {
            if ( error ) {
                deferred.reject( error);
            } else {
                deferred.resolve(result);
            }
        });
    }
};
