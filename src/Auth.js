"use strict";

/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module Auth
 */

//The storage service
var defaultConfig = require('./defaultConfig.js');
var storage = require('./Storage.js');
var OAuth = new require('./OAuth.js');
 
/**
 * Auth service, provides the API used
 * @constructor
 * @param originRmiService - The service used to call the host server
 * @param {Object} config - Optional configuration object
 */
module.exports = function Auth(originRmiService, config) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof Auth)) {
        return new Auth();
    }
    if (!config) {
        config = defaultConfig;
    } else {
        config = {...config, ...defaultConfig};
    }
    const auth = this;
    this.originRmiService = originRmiService;
    
    this.prefixedTokenName = config.tokenPrefix ? [config.tokenPrefix, config.tokenName].join('_') : config.tokenName;

   /**
    * Login directlly to the origin server
    */
    this.login = (user, options) => auth.originRmiService.login(user, options);
     
   /**
    * Signup on the origin server for a new account
    */
    this.signup = (user, options) => auth.originRmiService.signup(user, options);

   /**
    * Remove locally stored authentication
    */
    this.logout = () => {
        storage.remove(this.prefixedTokenName);
    };
    this.authenticate = (name, data) => OAuth.authenticate(name, data),

    //link ommited, since it is the same as authenticate

    this.unlink = (name, options) => OAuth.unlink(name, options),
   /**
    * Check if a user is currentlly logged on
    * @return {boolean} - True if a user is currentlly logged on
    */
    this.isAuthenticated = () => {
        const token = storage.get(this.prefixedTokenName);

        if (token) {  // Token is present
            if (token.split('.').length === 3) {  // Token with a valid JWT format XXX.YYY.ZZZ
                try { // Could be a valid JWT or an access token with the same format
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace('-', '+').replace('_', '/');
                    const exp = JSON.parse(window.atob(base64)).exp;
                    if (typeof exp === 'number') {  // JWT with an optonal expiration claims
                        return Math.round(new Date().getTime() / 1000) < exp;
                    }
                } catch (e) {
                    return true;  // Pass: Non-JWT token that looks like JWT
                }
            }
            return true;  // Pass: All other tokens
        }
        return false; // Fail: No token at all
    };

   /**
    * Extract the payload from the stored JWT
    */
    this.getPayload = () => {
        const token = storage.get(auth.prefixedTokenName);

        if (token && token.split('.').length === 3) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(decodeBase64(base64));
            } catch (e) {
                // no-op
            }
        }
    };

   /**
    * Get the JWT token from storage
    */
    this.getToken = ()  => {
        return storage.get(auth.prefixedTokenName);
    };
   
   /**
    * Set the JWT token into storage
    */
    this.setToken = (token) => storage.setToken({ access_token: token });
     
   //remove token ommited since it is the same function as logout

   /**
    * Set the type of storage to use
    */
    this.setStorageType = (type) => storage.setStorageType(type);
};

function decodeBase64 (str) {
    let buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {
            // noop
        }
    }

    let fromCharCode = String.fromCharCode;

    let re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');

    let cb_btou = function (cccc) {
        switch (cccc.length) {
            case 4: {
                let cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3));
                let offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
            }
            case 3: {
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2))
                );
            }
            default: {
                return fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1))
                );
            }
        }
    };

    let btou = function (b) {
        return b.replace(re_btou, cb_btou);
    };

    let _decode = buffer ? function (a) {
        return (a.constructor === buffer.constructor
            ? a : new buffer(a, 'base64')).toString();
    }
    : function (a) {
        return btou(atob(a));
    };

    return _decode(
        String(str).replace(/[-_]/g, function (m0) {
            return m0 === '-' ? '+' : '/';
        }).replace(/[^A-Za-z0-9\+\/]/g, '')
    );
}