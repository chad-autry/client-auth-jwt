"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module OAuth
 */

//The provider configurations
const ProviderOAuthConfigs = require('./ProviderOAuthConfigs.js');
const url = require('url');
var qs = require('querystring');
 
/**
 * OAuth service, handles the workflow to authorize a user with 3rd party services
 * @constructor
 * @param config - The config for auth-jwt
 * @param authService - The top level authorization service to use
 * @param originRmiService - The service used to call the host server (not required for all workflows)
 */
module.exports = function OAuth(config, authService, originRmiService) {
    this.config = config;
    this.authService = authService;
    this.originRmiService = originRmiService;
};

/**
 * Start an authentication workflow with the remote service using the given options
 * Doubles to link a user to a new service, if already authenticated
 * @param {Object} options - The options controlling the workflow
 */
module.exports.prototype.authenticate = function(name, userData, prefixedTokenName) {
    const provider = ProviderOAuthConfigs[name];
    
    switch (provider.oauthType) {
        case '1.0': {
            //oauth = new OAuth1(this.$http, this.$window, this.SatellizerConfig, this.SatellizerPopup);
            break;
        }
        case '2.0': {
            //Pop up a window for the provider's url
            const providerUrl = [provider.authorizationEndpoint, buildQueryString(provider)].join('?');
            const width = provider.width || 500;
            const height = provider.height || 500;
            const options = {
                width: width,
                height: height,
                top: window.screenY + ((window.outerHeight - height) / 2.5),
                left: window.screenX + ((window.outerWidth - width) / 2)
            };
            const popup = window.open(providerUrl, '_blank', stringifyOptions(options, ','));
        
            if (url === 'about:blank') {
                popup.document.body.innerHTML = 'Loading...';
            }
            pollPopup(popup, provider, prefixedTokenName, this.authService);
            //Poll the popup to see if it is sent to the backend, then forwarded
            //Extract the info from the popup
            //If needed (some special cases) use the rmiService to make a manual call to the backend
        
            break;
        }
        default: {
            //return reject(new Error('Invalid OAuth Type'));
        }
    }
};

/**
 * Local utility method
 * @return {string} - The query string
 */
function buildQueryString(providerOptions) {
    const keyValuePairs = [];
    const urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    urlParamsCategories.forEach((paramsCategory) => {
        providerOptions[paramsCategory].forEach( (paramName) => {
            const camelizedName = camelCase(paramName);
            let paramValue = isFunction(providerOptions[paramName]) ? providerOptions[paramName]() : providerOptions[camelizedName];

            if (paramName === 'redirect_uri' && !paramValue) {
                return;
            }

            if (paramName === 'scope' && Array.isArray(paramValue)) {
                paramValue = paramValue.join(providerOptions.scopeDelimiter);
                if (providerOptions.scopePrefix) {
                    paramValue = [providerOptions.scopePrefix, paramValue].join(providerOptions.scopeDelimiter);
                }
            }
            keyValuePairs.push([paramName, paramValue]);
        });
    });

    return keyValuePairs.map(pair => pair.join('=')).join('&');
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, (_, separator, letter, offset) => {
        return offset ? letter.toUpperCase() : letter;
    });
}

function stringifyOptions(options) {
    const parts = [];
    for (var prop in options) {
        // skip loop if the property is from prototype
        if(!options.hasOwnProperty(prop)) continue;

        parts.push(prop + '=' + options[prop]);
    }

    return parts.join(',');
}

function pollPopup(window, properties, prefixedTokenName, authService) {
    const redirectUri = url.parse(properties.redirectUri);
    const redirectUriPath = redirectUri.host + redirectUri.pathname;

    const polling = setInterval(() => {
        if (!window || window.closed) {
            clearInterval(polling);
        }
        try {
            const popupUrlPath = window.location.host + window.location.pathname;

            if (popupUrlPath.startsWith(redirectUriPath)) {
                const query = qs.parse(window.location.search.substring(1).replace(/\/$/, ''));
                const hash = qs.parse(window.location.hash.substring(1).replace(/[\/$]/, ''));
                const params = Object.assign({}, query, hash);

                if (params.error) {
                    console.error(params.error);
                    //TODO Error handler
                } else {
                    console.log(params);
                    //TODO Hard Coded Storage Type
                    authService.setToken(window.document.getElementById('token').innerHTML);
                    //storage.set(prefixedTokenName, window.document.getElementById('token').innerHTML, 'localStorage');
                    window.close();
              
                }
          
            }
        } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in Internet Explorer.
        }
    }, 500);
}