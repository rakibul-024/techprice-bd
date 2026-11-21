# TechPrice BD

Bengali-language tech price tracker for Dhaka, powered by the Tech Gadget Dor public API and Better Auth.

## Run locally

1. Install dependencies with `npm install`.
2. Put local settings in the repository-root `.env` or `.env.local` file. Next.js reads both; `.env.local` takes precedence over `.env`. Do not define an auth key as empty in `.env.local` if it has a value in `.env`.
3. Configure `MONGODB_URL` with your MongoDB Atlas URI and set `MONGODB_DATABASE=tech-price-db`. Authentication requires a reachable MongoDB instance; the public storefront does not.
4. Set a private random `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL=http://localhost:3000` for local development.
5. Add the OAuth values using the exact variable names in `.env.example`, then run `npm run dev` and open `http://localhost:3000`.

Never commit `.env` or `.env.local`, and never share OAuth client secrets in chat. Credentials shared outside your password manager should be revoked and replaced.

## Google and GitHub OAuth setup

Create separate OAuth clients for the app. In each provider's OAuth app settings, register the callback URL exactly as follows:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For production, set `BETTER_AUTH_URL=https://techprice-bd.vercel.app` in Vercel and register the production callback URLs below. The app resolves its Better Auth URL from the incoming host, restricted to the production domain and Vercel's deployment URLs, so production OAuth callbacks do not point to localhost. After changing Vercel environment values, redeploy the app. The client ID and client secret must belong to the same OAuth app.

For production, register `https://techprice-bd.vercel.app/api/auth/callback/google` and `https://techprice-bd.vercel.app/api/auth/callback/github` with the corresponding providers. GitHub OAuth Apps have a single callback URL, so use separate local and production GitHub OAuth Apps if you need both environments.

Keep each OAuth attempt on the same origin from start to finish. Do not start sign-in on `techprice-bd.vercel.app` and return to `localhost:3000`, or vice versa; the OAuth state cookie is host-specific and that produces `state_mismatch`. Locally, if Next.js starts on a different port because port `3000` is occupied, the app accepts localhost ports dynamically; register the actual callback URL with the local OAuth app.

### OAuth troubleshooting

- **GitHub shows a 404 / “Page not found”:** verify that `GITHUB_CLIENT_ID` belongs to an existing GitHub OAuth App and that its secret is the matching `GITHUB_CLIENT_SECRET`. An app ID that is deleted, mistyped, or from a different app cannot be repaired by changing the sign-in page.
- **The sign-in form shows `Invalid origin` on Vercel:** redeploy the latest app version and set Vercel's `BETTER_AUTH_URL` to `https://techprice-bd.vercel.app`. Confirm the request is made from the deployed site, not a localhost tab.
- **Better Auth shows `invalid_code`:** restart sign-in and complete it once without reusing an old callback URL. Confirm the provider's callback URL matches `BETTER_AUTH_URL` exactly, including the host, port, HTTPS scheme, and `/api/auth/callback/<provider>` path. Also check that the client ID and secret are from the same OAuth app.
- **Better Auth shows `account_not_linked`:** log in with the method originally used for that email (for example, email and password). In `/profile`, use **সোশ্যাল লগইন সংযুক্ত করুন** and explicitly connect Google or GitHub. This avoids silently attaching an unverified email account to a social identity.
- **Provider button is disabled:** both ID and secret must be set for that provider. Check for empty values in higher-priority `.env.local` or `.env.development.local` files.
- **Email sign-up/sign-in cannot reach the server:** verify MongoDB is running/reachable and `MONGODB_URL` is valid. User/session data is stored in the `tech-price-db` database.

The ticker initially renders live API data, refreshes it every 60 seconds through the same-origin `/api/market/ticker` route, and keeps the last successful rates visible if a refresh fails. When the OS requests reduced motion, the ticker starts paused; use its play button to enable scrolling explicitly.

The Next.js security insight shown by older dev processes is addressed by the patched Next.js and `eslint-config-next` version in `package.json`. Stop and restart `npm run dev` after installing dependencies so the process no longer uses the old version.

## Environment variables

See [`.env.example`](./.env.example). `MONGODB_DATABASE` defaults to `tech-price-db`; OAuth credentials are optional until social sign-in is used. Do not copy real credentials into the example file.

## Scripts

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run build` — production build
- `npm start` — serve the production build
