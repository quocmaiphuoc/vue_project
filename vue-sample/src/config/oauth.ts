/**
 * OAuth Configuration
 */

export interface OAuthConfig {
  clientId: string
  clientSecret?: string
  redirectUri: string
  scope?: string[]
  authorizationEndpoint: string
  tokenEndpoint: string
}

export const oauthConfig: OAuthConfig = {
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI || window.location.origin,
  scope: ['openid', 'profile', 'email'],
  authorizationEndpoint: import.meta.env.VITE_OAUTH_AUTHORIZATION_ENDPOINT || '',
  tokenEndpoint: import.meta.env.VITE_OAUTH_TOKEN_ENDPOINT || '',
}

export default oauthConfig

