const tenantId = import.meta.env.VITE_AZURE_AD_TENANT_ID || 'YOUR_TENANT_ID'
const clientId = import.meta.env.VITE_AZURE_AD_CLIENT_ID || 'YOUR_CLIENT_ID'
const redirectUri =
  import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin
const scopesEnv = import.meta.env.VITE_AZURE_AD_SCOPES || 'User.Read'

export const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
}

export const loginRequest = {
  scopes: scopesEnv
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean)
}
