# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## Azure AD login setup

Create a `.env` file in the project root with your Azure AD values:

```
VITE_AZURE_AD_TENANT_ID=<tenant-guid>
VITE_AZURE_AD_CLIENT_ID=<app-registration-client-id>
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173
# Optional: scopes the app should request (comma separated)
VITE_AZURE_AD_SCOPES=User.Read,openid,profile,email
```

Ensure the redirect URI is added to your app registration in the Azure portal.

### Compile and Minify for Production

```sh
npm run build
```
