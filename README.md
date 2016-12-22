# auth-jwt
auth-jwt is a simple to use, end-to-end, token-based authentication module for any SPA with built-in support for Google, Facebook, LinkedIn, Twitter, Instagram, GitHub, Bitbucket, Yahoo, Twitch, Microsoft (Windows Live) OAuth providers, as well as Email and Password sign-in. However, you are not limited to the sign-in options above, in fact you can add any OAuth 1.0 or OAuth 2.0 provider by passing provider-specific information in the app config block.

While not a true fork, much has been copied from [Satellizer](https://github.com/sahat/satellizer).

* No Angular, so no dependency Injection
* Written without typescript, using syntax I'm most comfortable with
* Written with the build system I'm most comfrotable with
* Refactored classes to make a bit simpler to my way of thinking
* Consolidated RedirectURL and URL
    * The redirectURL is expected to embed the token in the response body
    * Must be on same domain as page orgin
    * No plan yet for how to link accounts
* Removed redundant methods

## Useage
```
//Require and instantiate a jquery based RMI service to contact the origin host
var jqueryRMI = new require('auth-jwt/JqueryRMI')(jquery);

//Require and instantiate an Auth service, passing in the jqueryRMI instance
var authService = new require('auth-jwt')(jqueryRMI);

//Configure the 3rd party providers on the service as required
authService.providerOAuthConfigs['google'].clientId = 'GoogleClientId';

//After authenticating on the server, respond with the token embeded in the html
<html>
    <body>
        <!--This token is pre-created with 'John Doe' as the user in the payload for the static demo.
            Normally a server would validate the authorization parameters and dynamically generate a JWT-->
        <div id="token">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UifQ.xuEv8qrfXu424LZk8bVgr9MQJUIrp1rHcPyZw_KSsds</div>
    </body>
</html>

//Listen to the Auth service for authentication changes

//Use authService.isAuthenticated() to control showing login button
//Get data embedded in the JWT from the server, for client side use authService.getPayload().name

```
