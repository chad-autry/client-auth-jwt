"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module Auth
 */

//The storage service
var storage = require('./Storage.js');
 
/**
 * Auth service, provides the API used
 * @constructor
 * @param originRmiService - The service used to call the host server
 */
 module.exports = function Auth(originRmiService) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof Auth)) {
        return new Auth();
    }
    auth = this;
    this.originRmiService = originRmiService;
    
    //TODO
    this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;

   /**
    * Login directlly to the origin server 
    */
    this.login = (user, options) => auth.originRmiService.login(user, options);
     
   /**
    * Signup on the origin server for a new account
    */
    this.signup = (user, options) => auth.originRmiService.signup(user, options);

   /**
    * 
    */
    this.logout = () => { 
        storage.remove(this.prefixedTokenName);
        return this.$q.when() 
    };
    this.authenticate = function(name, data) => SatellizerOAuth.authenticate(name, data),
    this.link = function(name, data) => SatellizerOAuth.authenticate(name, data),
    this.unlink = function(name, options) => SatellizerOAuth.unlink(name, options),
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
    this.getPayload = function() => SatellizerShared.getPayload(),
    this.getToken = function() => SatellizerShared.getToken(),
    this.setToken = function(token) => SatellizerShared.setToken({ access_token: token }),
    this.removeToken = function() => SatellizerShared.removeToken(),
   /**
    * Set the type of storage to use
    */
    this.setStorageType = (type) => storage.setStorageType(type);
};

  getToken(): string {
    return this.SatellizerStorage.get(this.prefixedTokenName);
  }

  getPayload(): any {
    const token = this.SatellizerStorage.get(this.prefixedTokenName);

    if (token && token.split('.').length === 3) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(decodeBase64(base64));
      } catch (e) {
        // no-op
      }
    }
  }

  setToken(response): void {
    const tokenRoot = this.SatellizerConfig.tokenRoot;
    const tokenName = this.SatellizerConfig.tokenName;
    const accessToken = response && response.access_token;

    let token;

    if (accessToken) {
      if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
        response = accessToken;
      } else if (angular.isString(accessToken)) {
        token = accessToken;
      }
    }

    if (!token && response) {
      const tokenRootData = tokenRoot && tokenRoot.split('.').reduce((o, x) => o[x], response.data);
      token = tokenRootData ? tokenRootData[tokenName] : response.data && response.data[tokenName];
    }

    if (token) {
      this.SatellizerStorage.set(this.prefixedTokenName, token);
    }
  }
