# Netlify Deployment Guide

## Steps to Deploy to Netlify

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `out` folder to deploy
   - OR connect your GitHub repository

3. **Netlify Configuration:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

## Important Notes

- The project is configured for static export
- Admin pages use dynamic imports to prevent Firebase errors during static build
- Firebase configuration has fallback values for static export
- All assets are optimized for static hosting

## Environment Variables

Firebase environment variables are now configured in two places:

1. **In the code:** Firebase config in `src/lib/firebase.ts` has fallback values for static export

2. **In netlify.toml:** Environment variables are set in the `[build.environment]` section

3. **In Netlify UI (optional):** You can also set these in Netlify's UI if you prefer:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Troubleshooting

If you encounter Firebase errors during build:
1. Make sure the Firebase config in `src/lib/firebase.ts` has correct fallback values
2. Verify that all admin pages use the `withDynamicImport` HOC
3. Check that `netlify.toml` has the correct environment variables

If you get "Page not found" errors:
1. Make sure `netlify.toml` is in the root directory
2. Check that the build output is in the `out` directory
3. Verify that the redirect rules are working
