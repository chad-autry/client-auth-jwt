# auth-jwt
auth-jwt is a simple to use, end-to-end, token-based authentication module for any SPA with built-in support for Google, Facebook, LinkedIn, Twitter, Instagram, GitHub, Bitbucket, Yahoo, Twitch, Microsoft (Windows Live) OAuth providers, as well as Email and Password sign-in. However, you are not limited to the sign-in options above, in fact you can add any OAuth 1.0 or OAuth 2.0 provider by passing provider-specific information in the app config block.

While not a true fork, much has been copied from [Satellizer](https://github.com/sahat/satellizer).

* No Angular, so no dependency Injection
* Written without typescript, using syntax I'm most comfortable with
* Written with the build system I'm most comfrotable with
* Refactored classes to make a bit simpler to my way of thinking
* Removed redundant methods

## Useage
```
//Require and instantiate a jquery based RMI service to contact the origin host
var jqueryRMI = new require('auth-jwt/JqueryRMI')(jquery);

//Require and instantiate an Auth service, passing in the jqueryRMI instance
var authService = new require('auth-jwt')(jqueryRMI);

//Configure the 3rd party providers on the service as required
authService.providerOAuthConfigs['google'].clientId = 'GoogleClientId';

//Bind authService.isAuthenticated() to control showing login button
//Get data embedded in the JWT from the server, for client side use authService.getPayload().name

```
