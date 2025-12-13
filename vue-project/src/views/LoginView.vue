<script setup>
import { onMounted, reactive } from 'vue'
import { PublicClientApplication } from '@azure/msal-browser'
import { loginRequest, msalConfig } from '../authConfig.js'

const state = reactive({
  account: null,
  loading: true,
  error: ''
})

const client = new PublicClientApplication(msalConfig)

const setActiveAccount = () => {
  const accounts = client.getAllAccounts()
  state.account = accounts[0] ?? null
}

const handleError = (error) => {
  if (!error) return 'Unknown error'
  if (error.errorMessage) return error.errorMessage
  if (error.message) return error.message
  return String(error)
}

onMounted(async () => {
  try {
    await client.initialize()
    setActiveAccount()
  } catch (error) {
    state.error = handleError(error)
  } finally {
    state.loading = false
  }
})

const handleLogin = async () => {
  state.error = ''
  state.loading = true
  try {
    const result = await client.loginPopup(loginRequest)
    client.setActiveAccount(result.account)
    state.account = result.account
  } catch (error) {
    state.error = handleError(error)
  } finally {
    state.loading = false
  }
}

const handleLogout = async () => {
  state.error = ''
  state.loading = true
  try {
    await client.logoutPopup({ account: state.account ?? undefined })
    state.account = null
  } catch (error) {
    state.error = handleError(error)
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <section class="card card--single">
    <header class="card__header">
      <div class="logo">AD</div>
      <div>
        <p class="eyebrow">Secure sign in</p>
        <h1>Azure AD login</h1>
        <p class="lead">
          Authenticate with your Microsoft work or school account to continue.
        </p>
      </div>
    </header>

    <div class="status">
      <p v-if="state.loading" class="muted">Checking your session…</p>
      <template v-else>
        <p v-if="state.account">
          Signed in as <strong>{{ state.account.username }}</strong>
        </p>
        <p v-else>Use your Azure AD account to get started.</p>
      </template>
    </div>

    <div class="actions">
      <button v-if="!state.account" :disabled="state.loading" @click="handleLogin">
        {{ state.loading ? 'Opening Microsoft...' : 'Sign in with Microsoft' }}
      </button>
      <button v-else :disabled="state.loading" class="secondary" @click="handleLogout">
        Sign out
      </button>
    </div>

    <p v-if="state.error" class="error">{{ state.error }}</p>

    <footer class="helper">
      <p>
        Set `VITE_AZURE_AD_TENANT_ID`, `VITE_AZURE_AD_CLIENT_ID`, and
        `VITE_AZURE_AD_REDIRECT_URI` in your `.env` file. Optional:
        `VITE_AZURE_AD_SCOPES` (comma-separated).
      </p>
    </footer>
  </section>
</template>
