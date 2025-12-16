<script setup>
import { onMounted, reactive } from 'vue'
import { PublicClientApplication } from '@azure/msal-browser'
import { loginRequest, msalConfig } from '../authConfig.js'
import Message from 'primevue/message'
import Tag from 'primevue/tag'

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
  <div class="card-space">
    <Card class="w-full login-card">
      <template #title>
        <div class="flex align-items-center gap-3">
          <i class="pi pi-shield text-primary text-xl"></i>
          <div>
            <p class="eyebrow">Secure sign in</p>
            <span class="text-2xl font-semibold">Azure AD login</span>
          </div>
        </div>
      </template>

      <template #subtitle>
        Authenticate with your Microsoft work or school account to continue.
      </template>

      <div class="grid mt-2" style="row-gap: 1rem">
        <div class="col-12 md:col-12 flex flex-column gap-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-900"></i>
            <span v-if="state.loading" class="text-600">Checking your session…</span>
            <template v-else>
              <span v-if="state.account" class="flex gap-2 align-items-center">
                <Tag severity="success" value="Signed in" />
                <strong>{{ state.account.username }}</strong>
              </span>
              <span v-else class="text-600">Use your Azure AD account to get started.</span>
            </template>
          </div>

          <div class="flex gap-2 flex-wrap">
            <Button
              v-if="!state.account"
              :loading="state.loading"
              icon="pi pi-microsoft"
              label="Sign in with Microsoft"
              class="p-button-raised"
              @click="handleLogin"
            />
            <Button
              v-else
              :loading="state.loading"
              icon="pi pi-sign-out"
              label="Sign out"
              severity="secondary"
              class="p-button-outlined"
              @click="handleLogout"
            />
          </div>

          <Message v-if="state.error" severity="error" :closable="false">{{ state.error }}</Message>
        </div>

        <div class="col-12 md:col-5">
          <div class="surface-50 border-1 surface-border border-round p-3 flex flex-column gap-2">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-info-circle text-primary"></i>
              <strong>Azure AD settings</strong>
            </div>
            <p class="text-sm m-0 text-600">
              Set <code>VITE_AZURE_AD_TENANT_ID</code>, <code>VITE_AZURE_AD_CLIENT_ID</code>, and
              <code>VITE_AZURE_AD_REDIRECT_URI</code> in your <code>.env</code> file. Optional:
              <code>VITE_AZURE_AD_SCOPES</code> (comma-separated).
            </p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  color: var(--text-color-secondary);
}

.login-card {
  border: 1px solid #e4e9f2;
  border-radius: 16px;
}
</style>
