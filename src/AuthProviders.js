"use strict";
/**
 * An object map of the various built in 3rd Party OAuth(1 | 2) providers
 * They need to be configured before use (with the app token generally)
 * @module AuthProviders
 */
 
var OAuth1Provider = require('./OAuth1Provider.js');
var OAuth2Provider = require('./OAuth2Provider.js');
 
module.exports = {
  facebook: new OAuth2Provider(),
  google: new OAuth2Provider(),
  github: new OAuth2Provider(),
  instagram: new OAuth2Provider(),
  linkedin: new OAuth2Provider(),
  twitter: new OAuth1Provider(),
  twitch: new OAuth2Provider(),
  live: new OAuth2Provider(),
  yahoo: new OAuth2Provider(),
  bitbucket: new OAuth2Provider(),
  spotify: new OAuth2Provider()
};
