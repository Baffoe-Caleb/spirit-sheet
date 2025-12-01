// src/auth0Config.ts
const auth0Config = {
    domain: import.meta.env.VITE_APP_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID || '',
    audience: import.meta.env.VITE_APP_AUTH0_AUDIENCE || '',
    redirectUri: import.meta.env.VITE_APP_AUTH0_REDIRECT_URI || window.location.origin,
    scope: 'openid profile email'
};
// Validation
if (!auth0Config.domain) {
    console.error('Auth0 Domain is not configured properly');
    throw new Error('Auth0 Domain is not configured');
}
if (!auth0Config.clientId) {
    console.error('Auth0 Client ID is not configured properly');
    throw new Error('Auth0 Client ID is not configured');
}
export default auth0Config;