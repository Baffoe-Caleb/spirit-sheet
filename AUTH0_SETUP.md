# Auth0 Setup Guide

This application uses Auth0 for authentication. Follow these steps to set up Auth0:

## Prerequisites

- An Auth0 account (free tier available at https://auth0.com)

## Configuration Steps

### 1. Create an Auth0 Account

1. Go to https://auth0.com and sign up for a free account
2. Complete the account setup process

### 2. Create an Application

1. In the Auth0 Dashboard, go to "Applications" in the left sidebar
2. Click "Create Application"
3. Configure the application:
   - **Name**: Church Attendance App (or your preferred name)
   - **Application Type**: Single Page Web Applications
4. Click "Create"

### 3. Configure Application Settings

1. In your application settings, configure the following:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
2. Click "Save Changes"

### 4. Get Your Auth0 Credentials

From your application settings page, note:
- **Domain** (e.g., `your-tenant.auth0.com`)
- **Client ID** (e.g., `abc123xyz...`)

## Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

Replace `your-tenant.auth0.com` with your actual Auth0 domain and `your-client-id` with your actual Client ID.

## Testing

1. Start your application: `npm run dev`
2. The app will automatically redirect to Auth0 login
3. Sign up with your email or social login
4. After successful login, you'll be redirected back to the app

## Production Setup

For production:

1. Add your production URL to:
   - Allowed Callback URLs: `https://yourdomain.com`
   - Allowed Logout URLs: `https://yourdomain.com`
   - Allowed Web Origins: `https://yourdomain.com`
2. Update environment variables with production Auth0 credentials
3. Enable Multi-Factor Authentication (optional but recommended)
4. Configure custom domains (optional)

## Free Tier Limits

Auth0 free tier includes:
- Up to 7,000 active users
- Unlimited logins
- Social login providers (Google, Facebook, etc.)
- Email/password authentication
- Basic user management

## Additional Features

### Social Connections

1. Go to "Authentication" > "Social" in Auth0 Dashboard
2. Enable desired social providers (Google, Facebook, GitHub, etc.)
3. Configure each provider with their API credentials

### Custom Branding

1. Go to "Branding" in Auth0 Dashboard
2. Customize the login page with your logo and colors
3. Configure email templates

## Troubleshooting

### "Callback URL mismatch" error
- Verify that your callback URLs match exactly in Auth0 settings
- Ensure the protocol (http/https) and port match

### "Origin not allowed" error
- Check that Web Origins is configured correctly in Auth0
- Add `http://localhost:5173` for local development

### Users can't sign up
- Check that "Disable Sign Ups" is not enabled in your Auth0 Database settings
- Go to "Authentication" > "Database" > Your connection > "Settings"

## Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 Community](https://community.auth0.com)
