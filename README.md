# OAuth 2.0 Authorization Code Flow Implementation

- Based on [oauth2orize library](https://github.com/jaredhanson/oauth2orize/), authenticating the user using [passport library](https://github.com/jaredhanson/passport), to build the basics of the OpenID Connect federated authentication service.

- OAuth End-Points
  * /authorize
  * /decision
  * /token
  
- Summary of Security enhancement added (*for demonstrative purpose*):
  * HTTPS using self-signed cert (enabled on consumer and provider)
  * Secure Headers (use Helmet)
  * HTTP Strict Transport Security (enabled)
  * Public Key Pinning for HTTP (HPKP) (pending for now)
  * X-Frame-Options (set to same origin)
  * X-XSS-Protection (enabled)
  * X-Content-Type-Options (set to nosniff)
  * Referrer-Policy(set to same origin)
  * Content-Security-Policy (set to ‘selfʼ)
  * No cache (enabled)
  * 'x-powered-by' header (removed)
  * Secure token generation (use crypto.randomBytes)
  * Sanitize all user input: username, password, scope
  * Password hash storage (use PBKDF2)
  * Cookie header flags (added secure flag, set expiration date)
  * Prevent rogue ClientApplication misusing scope (binding and validating token and scope)
  * Random Salt per password
  * Input Sanitization
  
- Todo
  * Password strength check
  * Password recovery
  * Login protection: brute force, CAPTCHA, account lockout, MFA, security questions, disable AutoComplete on password field(?), Remember me
  * New user protection: bot registration, username enumeration(email as username, generated username)
  * Token expiration and purging mgmt
  * Scope array support
  * Remove error info
  * Audit log (Authentication events, key transactions etc.)
  * Move credential from in-memory to DB (in progress…)
