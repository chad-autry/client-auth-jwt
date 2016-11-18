"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module Storage
 */
 
 let memoryStore = {};
 
/**
 * Export a static container object with utility methods
 */
module.exports = {};

/**
 * Start an authentication workflow with the remote service using the given options
 * Doubles to link a user to a new service, if already authenticated
 * @param {Object} options - The options controlling the workflow
 */
module.exports.prototype.authenticate = function(name, userData) {
    const provider = ProviderOAuthConfigs[name];
};

/**
 * Retrieve a key from the specified storage type, or local memory storage on on failure
 * @param {String} key - The key to retrieve a value for
 * @param {String} storageType - should be localStorage | sessionStorage
 * @return {String} - The value stored for the key
 */
module.exports.get = function(key, storageType) {
    try {
        return window[storageType].getItem(key);
    } catch (e) {
        return memoryStore[key];
    }
};

/**
 * Set a key/value pair into the specified storage type, or local memory storage on on failure
 * @param {String} key - The key to set a value for
 * @param {String} value - The value to set
 * @param {String} storageType - should be localStorage | sessionStorage
 */
module.exports.set = function(key, value, storageType) {
    try {
        window[storageType].setItem(key, value);
    } catch (e) {
        memoryStore[key] = value;
    }
};

/**
 * Remove a key and value from the specified storage type, or local memory storage on on failure
 * @param {String} key - The key to be deleted
 * @param {String} storageType - should be localStorage | sessionStorage
 */
module.exports.remove = function(key, storageType) {
    try {
        window[storageType].removeItem(key);
    } catch (e) {
        delete memoryStore[key];
    }
};
