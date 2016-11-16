"use strict";
/**
 * Export the application options.
 * @module Config
 */

module.exports = {
    baseUrl: '/',
    loginUrl: '/auth/login',
    signupUrl: '/auth/signup',
    unlinkUrl: '/auth/unlink/',
    tokenName: 'token',
    tokenPrefix: 'satellizer',
    tokenHeader: 'Authorization',
    tokenType: 'Bearer',
    storageType: 'localStorage',
    tokenRoot: null,
    withCredentials: false
};
