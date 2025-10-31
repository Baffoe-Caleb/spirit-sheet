import Keycloak from 'keycloak-js';

// Configure your Keycloak instance
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'church-attendance',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'church-app',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
