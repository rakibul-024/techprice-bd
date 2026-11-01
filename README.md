# TechPrice BD

Bengali-language tech price tracker for Dhaka, powered by the Tech Gadget Dor public API and Better Auth.

## Run locally

1. Install dependencies with `npm install`.
2. Put local settings in the repository-root `.env` or `.env.local` file. Next.js reads both; `.env.local` takes precedence over `.env`. Do not define an auth key as empty in `.env.local` if it has a value in `.env`.
3. Configure `MONGODB_URL` with your MongoDB Atlas URI and set `MONGODB_DATABASE=tech-price-db`. Authentication requires a reachable MongoDB instance; the public storefront does not.
4. Set a private random `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL=http://localhost:3000`.
5. Add the OAuth values using the exact variable names in `.env.example`, then run `npm run dev` and open `http://localhost:3000`.

Never commit `.env` or `.env.local`, and never share OAuth client secrets in chat. Credentials shared outside your password manager should be revoked and replaced.

## Google and GitHub OAuth setup

Create separate OAuth clients for the app. In each provider's OAuth app settings, register the callback URL exactly as follows:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For production, replace `localhost:3000` with the deployed app's HTTPS origin in both the provider settings and `BETTER_AUTH_URL`. After changing environment values, restart the dev server or redeploy so the auth server reads the new values. The client ID and client secret must belong to the same OAuth app.

If Next.js starts on a different port because port `3000` is already occupied, update `BETTER_AUTH_URL` and the provider callback URL to that actual port, then restart the server.

### OAuth troubleshooting

- **GitHub shows a 404 / “Page not found”:** verify that `GITHUB_CLIENT_ID` belongs to an existing GitHub OAuth App and that its secret is the matching `GITHUB_CLIENT_SECRET`. An app ID that is deleted, mistyped, or from a different app cannot be repaired by changing the sign-in page.
- **Better Auth shows `invalid_code`:** restart sign-in and complete it once without reusing an old callback URL. Confirm the provider's callback URL matches `BETTER_AUTH_URL` exactly, including the host, port, HTTPS scheme, and `/api/auth/callback/<provider>` path. Also check that the client ID and secret are from the same OAuth app.
- **Provider button is disabled:** both ID and secret must be set for that provider. Check for empty values in higher-priority `.env.local` or `.env.development.local` files.
- **Email sign-up/sign-in cannot reach the server:** verify MongoDB is running/reachable and `MONGODB_URL` is valid. User/session data is stored in the `tech-price-db` database.

## Environment variables

See [`.env.example`](./.env.example). `MONGODB_DATABASE` defaults to `tech-price-db`; OAuth credentials are optional until social sign-in is used. Do not copy real credentials into the example file.

## Scripts

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run build` — production build
- `npm start` — serve the production build
