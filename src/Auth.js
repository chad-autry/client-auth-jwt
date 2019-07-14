"use strict";

/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module Auth
 */

//The storage service
let defaultConfig = require('./defaultConfig.js');
let ProviderOAuthConfigs = require('./ProviderOAuthConfigs.js');
let storage = require('./Storage.js');
let OAuth = require('./OAuth.js');
let jwt = require('jwt-simple');
 
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
    const oauth = new OAuth(config, this, null);
    this.originRmiService = originRmiService;
    this.ProviderOAuthConfigs = ProviderOAuthConfigs;
    
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
        storage.remove(auth.prefixedTokenName, 'localStorage');
        if (this.authChangeCallBack) {
            this.authChangeCallBack();
        }
    };
    this.authenticate = (name, data) => {
        oauth.authenticate(name, data, auth.prefixedTokenName);
    }

    //link ommited, since it is the same as authenticate

    this.unlink = (name, options) => oauth.unlink(name, options);
   /**
    * Check if a user is currentlly logged on
    * @return {boolean} - True if a user is currentlly logged on
    */
    this.isAuthenticated = () => {
        const token = storage.get(this.prefixedTokenName, 'localStorage');

        if (token) {  // Token is present
            let jwtPayload = {};
            try {
                jwtPayload = jwt.decode(token, '', true);
            } catch (err) {
                return false;
            }
            if (typeof jwtPayload.exp === 'number') {  // JWT with an optonal expiration claims
                let now = Math.round(new Date().getTime() / 1000);
                return jwtPayload.exp > now;
            }
            
        }
        return false; // Fail: No token at all
    };

   /**
    * Extract the payload from the stored JWT
    */
    this.getPayload = () => {
        const token = storage.get(auth.prefixedTokenName, 'localStorage');

        if (token) {
            let jwtPayload = {};
            try {
                jwtPayload = jwt.decode(token, '', true);
            } catch (err) {
                return {};
            }
            return jwtPayload;
        }
        return {};
    };

   /**
    * Get the JWT token from storage
    */
    this.getToken = ()  => {
        return storage.get(auth.prefixedTokenName, 'localStorage');
    };
    
    /**
     * Set the callback for authentication changes
     */
    this.onAuthChange = (callBack) => this.authChangeCallBack = callBack;
   
   /**
    * Set the JWT token into storage
    */
    this.setToken = (token) => {
        //TODO Hard Coded storage type
        storage.set(auth.prefixedTokenName, token, 'localStorage');
        if (this.authChangeCallBack) {
            this.authChangeCallBack();
        }
    };
     
   //remove token ommited since it is the same function as logout

   /**
    * Set the type of storage to use
    */
    this.setStorageType = (type) => storage.setStorageType(type);
};