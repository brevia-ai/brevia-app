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

* `API_BASE_URL` Brevia API base URL
* `API_SECRET` Brevia API secret
* `BEDITA_API_BASE_URL` BEdita API base URL
* `BEDITA_API_KEY` BEdita API KEY
* `SESSION_NAME` The name used for session cookie (Brevia is used by default)
* `SESSION_SECRET` The secret used to crypt/decrypt the session stored in cookie. It must be at least 32 chars.
* (optional) `MAX_USER_CHATBOTS` The max number allowed per user (the max number a user can create)

## Session

To handle user session we take advantage of [`unjs/h3` sessions](https://github.com/unjs/h3#session).
Session data are sealed using `SESSION_SECRET` and saved in session cookie.

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

