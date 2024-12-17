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

### Authentication

To change the access credentials, edit `NUXT_BREVIA_AUTH_CREDENTIALS` and set some simple basic username/password items. Example:

```bash
NUXT_BREVIA_AUTH_CREDENTIALS='[{"username":"tizio","password":"incognito","name":"Tizio Incognito", "roles": ["user"]}]'
```

If `NUXT_BREVIA_AUTH_CREDENTIALS` is not set, you can log in using the default credentials:

* Username: `brevia`
* Password: `brevia`

### Session

Configure the session settings with the following variables:

```bash
## SESSION
NUXT_BREVIA_SESSION_NAME=Brevia
NUXT_BREVIA_SESSION_SECRET=example-32-characters-long-secret-key
```

* `NUXT_BREVIA_SESSION_NAME` (optional, default: `Brevia`) - The name of the session cookie.
* `NUXT_BREVIA_SESSION_SECRET` - A secret used to encrypt/decrypt the session cookie. It must be **at least 32 chars**.

## BEdita Integration

To activate BEdita integration, configure the following variables:

```bash
## BEDITA INTEGRATION
NUXT_BEDITA_API_BASE_URL=<BEDITA API BASE URL>
NUXT_BEDITA_API_KEY=<BEDITA API KEY>
NUXT_BEDITA_SESSION_NAME=bedita
NUXT_BEDITA_SESSION_SECRET=<BEDITA SESSION SECRET>
```

* `NUXT_BEDITA_API_BASE_URL` - BEdita API base URL.
* `NUXT_BEDITA_API_KEY` - BEdita API key.
* `NUXT_BEDITA_SESSION_NAME` (optional, default is `bedita`) - The name used for the session cookie.
* `NUXT_BEDITA_SESSION_SECRET` - The secret used to encrypt/decrypt the session stored in the cookie. It must be **at least 32 chars**.

### Recaptcha

To enable/disable Recaptcha you should edit these vars:

* `NUXT_PUBLIC_RECAPTCHA_ENABLED` (optional, default is `false`) Enable or disable Recaptcha
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
