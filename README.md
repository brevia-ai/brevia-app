# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies (using `npm`):

```bash
# npm
npm install
```

## Environment variables

Copy `.env.sample` in `.env` and set

* `NUXT_API_BASE_URL` Brevia API base URL
* `NUXT_API_SECRET` Brevia API secret
* `NUXT_BEDITA_API_BASE_URL` BEdita API base URL
* `NUXT_BEDITA_API_KEY` BEdita API KEY
* `NUXT_BEDITA_SESSION_NAME` The name used for session cookie (Brevia is used by default)
* `NUXT_BEDITA_SESSION_SECRET` The secret used to crypt/decrypt the session stored in cookie. It must be **at least 32 chars**.
* `NUXT_PUBLIC_RECAPTCHA_ENABLED` (optional, default is `true`)  Enable or disable Recaptcha
* `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` (required if Recaptcha is enabled) Recaptcha site key
* `NUXT_BEDITA_RECAPTCHA_SECRET_KEY` (required if Recaptcha is enabled) Recaptcha secret key
* `NUXT_PUBLIC_MAX_USER_CHATBOTS` (optional) The max number allowed per user (the max number a user can create)

## Session

To handle user session we take advantage of [`unjs/h3` sessions](https://github.com/unjs/h3#session).
Session data are sealed using `NUXT_BEDITA_SESSION_SECRET` and saved in session cookie.

User session is used by `BEdita client` through `lib/services/adapters/session-storage-adapter.ts` to store `JWT` tokens and a basic set of authenticated user data (see `utils/user-data-store.ts`).

> At the moment there are some issues with BEdita client method `getUserAuth()` and session so if you need to load more user data
> please use `client.get('/auth/user')`

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

To start the application:

```bash
npm start
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

