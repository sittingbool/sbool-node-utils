var crypto = require('crypto'),
// https://en.wikipedia.org/wiki/Camellia_%28cipher%29
algo = process.env.CIPHER_UTIL_ALGO,  // e.g. 'camellia256',
dec = 'utf8',
// hex creates tokens, that are too long
pwEnc = 'hex',
enc = 'base64',
ivBlock = 16,
pw = process.env.CIPHER_UTIL_PW || '',
querystring = require('querystring');

/**
 * Utility to encrypt and decrypt strings.
 * The crypted data will be hex-encoded, while the input data should be utf8 encoded.
 * The used password in this utility is defined in the head.
 * The used algorithm is camellia256.
 * @module module:CipherUtil
 */
module.exports = /** * @lends module:CipherUtil */ {

    /**
     * Crypt string with defined password, algorithm and IV (init vector (salt)).
     *
     * @param string {String} String to encrypt.
     * @return {String | Null} Encrypted string.
     */
    cipher: function cipher(string) {

        if(string) {

            if ( typeof pw !== 'string' || pw.length < 8 ) {
                throw new Error('Please set a password with 8 or ' +
                    'more chars on process.env.CIPHER_UTIL_PW!');
            }

            if ( typeof algo !== 'string' || algo.length < 1 ) {
                throw new Error('Please choose an algorithm' +
                    ' on process.env.CIPHER_UTIL_ALGO!');
            }

            var iv = crypto.randomBytes(ivBlock),

            ciphered = crypto.createCipheriv(algo, pw, iv),

            encrypted = [ciphered.update(string)];

            encrypted.push(ciphered.final());

            return Buffer.concat([iv, Buffer.concat(encrypted)]).toString(enc);

        }

        return null;

    },

    /**
     * Encrypt string with password and specified algorithm.
     *
     * @param string {String} String to encrypt.
     * @return {String | Null}
     */
    pwCipher: function pwCipher(string) {

        if(string) {

            if ( typeof pw !== 'string' || pw.length < 8 ) {
                throw new Error('Please set a password with 8 or ' +
                    'more chars on process.env.CIPHER_UTIL_PW!');
            }

            if ( typeof algo !== 'string' || algo.length < 1 ) {
                throw new Error('Please choose an algorithm' +
                    ' on process.env.CIPHER_UTIL_ALGO!');
            }

            var ciphered = crypto.createCipher(algo, pw),

            /*
             * Array
             */
            encrypted = [ciphered.update(string)];

            encrypted.push(ciphered.final());

            return Buffer.concat(encrypted).toString(pwEnc);

        }

        return null;

    },


    /**
     * Unescape crypted string, after decryption, to get "Umlaute" back.
     * After unescaping the string, {@link module:CipherUtil.pwDecipher} gets called.
     *
     * @param string {String} The to-decrypt-string.
     * @return {String | Null}
     */
    pwDecipherAndUnescape: function pwDecipherAndUnescape(string) {

        if (string) {
            return querystring.unescape(this.pwDecipher(string));
        }

        return null;

    },


    /**
     * To save "Umlaute", we need to escape the string before the encryption get's the
     * string.
     * This method calls {@link module:CipherUtil.pwCipher}
     * @param string {String} The to-encrypt-string.
     * @return {String | Null}
     */
    escapeAndPwCipher: function escapeAndPwCipher(string) {

        if (string) {
            return this.pwCipher(querystring.escape(string));
        }

        return null;

    },


    /**
     * Escape the string and call {@link CipherUtil#cipher}.
     *
     * @param string {String} String to escape and to encrypt.
     * @return {String | Null}
     */
    cipherAndEscape: function cipherAndEscape(string) {

        return querystring.escape(this.cipher(string));

    },


    /**
     * Decrypt string with defined password, algorithm and IV (init vector (salt)).
     *
     * @param string {String} String to decrypt.
     * @return {String | Null} Decrypted string.
     */
    decipher: function decipher(string) {

        if(string) {

            if ( typeof pw !== 'string' || pw.length < 8 ) {
                throw new Error('Please set a password with 8 or ' +
                    'more chars on process.env.CIPHER_UTIL_PW!');
            }

            if ( typeof algo !== 'string' || algo.length < 1 ) {
                throw new Error('Please choose an algorithm' +
                    ' on process.env.CIPHER_UTIL_ALGO!');
            }

            var buffer = new Buffer(string, enc),

            iv = buffer.slice(0, ivBlock),

            text = buffer.slice(ivBlock),

            toDecipher = crypto.createDecipheriv(algo, pw, iv),

            deciphered = [toDecipher.update(text)];

            deciphered.push(toDecipher.final());

            return Buffer.concat(deciphered).toString(dec);

        }

        return null;

    },

    /**
     * Decrypt string with password and specified algorithm.
     *
     * @param string {String} String to decrypt.
     * @return {String | Null}
     */
    pwDecipher: function pwDecipher(string) {

        if(string) {

            if ( typeof pw !== 'string' || pw.length < 8 ) {
                throw new Error('Please set a password with 8 or ' +
                    'more chars on process.env.CIPHER_UTIL_PW!');
            }

            if ( typeof algo !== 'string' || algo.length < 1 ) {
                throw new Error('Please choose an algorithm' +
                    ' on process.env.CIPHER_UTIL_ALGO!');
            }

            var buffer = new Buffer(string, pwEnc),

            toDecipher = crypto.createDecipher(algo, pw),

            deciphered = [toDecipher.update(buffer)];

            deciphered.push(toDecipher.final());

            return Buffer.concat(deciphered).toString(dec);

        }

        return null;

    },


    /**
     * Unescapes and decrypts string.
     * Will call {@link module:CipherUtil.decipher} with unescaped string.
     *
     * @param string {String} String to decrypt.
     * @return {String | Null}
     */
    unescapeAndDecipher: function unescapeAndDecipher(string) {

        return this.decipher(querystring.unescape(string));

    }

};
