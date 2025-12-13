import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import ExcelView from './views/ExcelView.vue'
import PdfView from './views/PdfView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, name: 'login' },
  { path: '/excel', component: ExcelView, name: 'excel' },
  { path: '/pdf', component: PdfView, name: 'pdf' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
