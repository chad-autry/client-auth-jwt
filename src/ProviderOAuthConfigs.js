"use strict";
/**
 * An object map of the various built in 3rd Party OAuth(1 | 2) provider configs
 * They need to be configured before use (with the app token generally)
 * @module ProviderOAuthConfigs
 */
 
var defaultOAuth1Config = require('./defaultOAuth1Config.js');
var defaultOAuth2Config = require('./defaultOAuth2Config.js');
 
module.exports = {
    facebook: {
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      popupOptions: { width: 580, height: 400 },
      ...defaultOAuth2Config
    },
    google: {
      name: 'google',
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display', 'state'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      popupOptions: { width: 452, height: 633 },
      state: () => encodeURIComponent(Math.random().toString(36).substr(2)),
      ...defaultOAuth2Config
    },
    github: {
      name: 'github',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      redirectUri: window.location.origin,
      optionalUrlParams: ['scope'],
      scope: ['user:email'],
      scopeDelimiter: ' ',
      popupOptions: { width: 1020, height: 618 },
      ...defaultOAuth2Config
    },
    instagram: {
      name: 'instagram',
      url: '/auth/instagram',
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      scope: ['basic'],
      scopeDelimiter: '+',
      ...defaultOAuth2Config
    },
    linkedin: {
      name: 'linkedin',
      url: '/auth/linkedin',
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
      redirectUri: window.location.origin,
      requiredUrlParams: ['state'],
      scope: ['r_emailaddress'],
      scopeDelimiter: ' ',
      state: 'STATE',
      popupOptions: { width: 527, height: 582 },
      ...defaultOAuth2Config
    },
    twitter: {
      name: 'twitter',
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin,
      popupOptions: { width: 495, height: 645 },
      defaultOAuth1Config
    },
    twitch: {
      name: 'twitch',
      url: '/auth/twitch',
      authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      scope: ['user_read'],
      scopeDelimiter: ' ',
      display: 'popup',
      popupOptions: { width: 500, height: 560 },
      ...defaultOAuth2Config
    },
    live: {
      name: 'live',
      url: '/auth/live',
      authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
      redirectUri: window.location.origin,
      requiredUrlParams: ['display', 'scope'],
      scope: ['wl.emails'],
      scopeDelimiter: ' ',
      display: 'popup',
      popupOptions: { width: 500, height: 560 },
      ...defaultOAuth2Config
    },
    yahoo: {
      name: 'yahoo',
      url: '/auth/yahoo',
      authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
      redirectUri: window.location.origin,
      scope: [],
      scopeDelimiter: ',',
      popupOptions: { width: 559, height: 519 },
      ...defaultOAuth2Config
    },
    bitbucket: {
      name: 'bitbucket',
      url: '/auth/bitbucket',
      authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['scope'],
      scope: ['email'],
      scopeDelimiter: ' ',
      popupOptions: { width: 1028, height: 529 },
      ...defaultOAuth2Config
    },
    spotify: {
      name: 'spotify',
      url: '/auth/spotify',
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      redirectUri: window.location.origin,
      optionalUrlParams: ['state'],
      requiredUrlParams: ['scope'],
      scope: ['user-read-email'],
      scopePrefix: '',
      scopeDelimiter: ',',
      popupOptions: { width: 500, height: 530 },
      state: () => encodeURIComponent(Math.random().toString(36).substr(2)),
      ...defaultOAuth2Config
    }
};


