# Keycloak Setup Guide

This application uses Keycloak for authentication. Follow these steps to set up Keycloak:

## Prerequisites

- Docker (for running Keycloak locally)
- Or access to an existing Keycloak server

## Quick Start with Docker

1. **Run Keycloak with Docker:**

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

2. **Access Keycloak Admin Console:**
   - URL: http://localhost:8080
   - Username: admin
   - Password: admin

## Configuration Steps

### 1. Create a Realm

1. Log in to the Keycloak Admin Console
2. Click on the dropdown in the top-left corner (shows "Master")
3. Click "Create Realm"
4. Name it: `church-attendance`
5. Click "Create"

### 2. Create a Client

1. In your new realm, go to "Clients" in the left sidebar
2. Click "Create Client"
3. Configure the client:
   - **Client ID**: `church-app`
   - **Client Protocol**: `openid-connect`
   - **Root URL**: `http://localhost:5173` (or your app URL)
4. Click "Save"
5. In the client settings:
   - **Valid Redirect URIs**: `http://localhost:5173/*`
   - **Web Origins**: `http://localhost:5173`
   - **Access Type**: `public`
6. Click "Save"

### 3. Create Test Users

1. Go to "Users" in the left sidebar
2. Click "Create User"
3. Fill in the details:
   - **Username**: testuser
   - **Email**: testuser@example.com
   - **First Name**: Test
   - **Last Name**: User
4. Click "Create"
5. Go to the "Credentials" tab
6. Set a password and disable "Temporary"

## Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=church-attendance
VITE_KEYCLOAK_CLIENT_ID=church-app
```

## Testing

1. Start your application: `npm run dev`
2. The app will automatically redirect to Keycloak login
3. Use the test user credentials you created
4. After successful login, you'll be redirected back to the app

## Production Setup

For production:

1. Use a properly configured Keycloak instance (not dev mode)
2. Enable SSL/HTTPS
3. Configure proper realm and client settings
4. Set up user federation if needed (LDAP, Active Directory, etc.)
5. Update environment variables with production URLs

## Troubleshooting

### "Invalid redirect URI" error
- Check that your redirect URIs are correctly configured in the Keycloak client settings
- Ensure the URLs match exactly (including protocol and port)

### CORS errors
- Verify that Web Origins is set correctly in the client settings
- Add `*` temporarily for testing, but use specific origins in production

### Token expiration
- Adjust token lifespans in Realm Settings > Tokens
- Implement token refresh in your application

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak JS Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
