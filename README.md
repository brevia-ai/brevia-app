# Brevia Admin

[Brevia API](https://github.com/brevia-ai/brevia) Admin webapp built with [Nuxt 3](https://nuxt.com/docs/getting-started/introduction).

## Setup

Make sure to install the dependencies (using `npm`):

```bash
# npm
npm install
```

## Environment variables

Copy `.env.sample` in `.env` and set at least

* `NUXT_API_BASE_URL` Brevia API base URL
* `NUXT_API_SECRET` Brevia API secret

With these env vars you can run a minimal version with default access credentials.

To change the access credentials edit `NUXT_BREVIA_AUTH_CREDENTIALS` and set some simple basic username/password items.

To activate BEdita integration edit:

* `NUXT_BEDITA_API_BASE_URL` BEdita API base URL
* `NUXT_BEDITA_API_KEY` BEdita API KEY
* `NUXT_BEDITA_SESSION_NAME` (optional, default is `bedita`) The name used for session cookie
* `NUXT_BEDITA_SESSION_SECRET` The secret used to crypt/decrypt the session stored in cookie. It must be **at least 32 chars**.

To enable/disable Recaptcha you should edit these vars:

* `NUXT_PUBLIC_RECAPTCHA_ENABLED` (optional, default is `false`)  Enable or disable Recaptcha
* `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` (required if Recaptcha is enabled) Recaptcha site key
* `NUXT_BEDITA_RECAPTCHA_SECRET_KEY` (required if Recaptcha is enabled) Recaptcha secret key

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
