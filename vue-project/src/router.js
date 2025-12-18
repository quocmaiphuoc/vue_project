import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import ExcelView from './views/ExcelView.vue'
import PdfView from './views/PdfView.vue'

const routes = [
  { path: '/', component: ExcelView, name: 'dashboard' },
  { path: '/login', component: LoginView, name: 'login' },
  { path: '/team', component: ExcelView, name: 'team' },
  { path: '/projects', component: ExcelView, name: 'projects' },
  { path: '/calendar', component: ExcelView, name: 'calendar' },
  { path: '/documents', component: ExcelView, name: 'documents' },
  { path: '/reports', component: ExcelView, name: 'reports' },
  { path: '/settings', component: ExcelView, name: 'settings' },
  { path: '/excel', component: ExcelView, name: 'excel' },
  { path: '/pdf', component: PdfView, name: 'pdf' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
