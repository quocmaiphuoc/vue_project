<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Layout from './components/Layout.vue'
import CertificateOfInsurance from './components/CertificateOfInsurance.vue'

const isLoggedIn = ref(false)
const userName = ref('Robert Fox')

const handleLogin = () => {
  isLoggedIn.value = true
}

const handleLogout = () => {
  isLoggedIn.value = false
}
</script>

<template>
  <Login v-if="!isLoggedIn" @login="handleLogin" />
  <Layout 
    v-else 
    :user-name="userName"
    @logout="handleLogout"
  >
    <CertificateOfInsurance />
  </Layout>
</template>

<style scoped></style>
