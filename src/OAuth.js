"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module OAuth
 */

//The storage service
var storage = require('./Storage.js');
//The provider configurations
const ProviderOAuthConfigs = require('./ProviderOAuthConfigs.js');
 
/**
 * OAuth service, handles the workflow to authorize a user with 3rd party services
 * @constructor
 * @param config - The config for auth-jwt
 * @param originRmiService - The service used to call the host server (not required for all workflows)
 */
module.exports = function OAuth(config, originRmiService) {
    this.config = config;
    this.originRmiService = originRmiService;
};

/**
 * Start an authentication workflow with the remote service using the given options
 * Doubles to link a user to a new service, if already authenticated
 * @param {Object} options - The options controlling the workflow
 */
module.exports.prototype.authenticate = function(name, userData) {
    const provider = ProviderOAuthConfigs[name];
};
