import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import Button from 'primevue/button'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import MenuBar from 'primevue/menubar'
import Breadcrumb from 'primevue/breadcrumb'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'

import App from './App.vue'
import { router } from './router'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { theme: { preset: Lara } })

app.component('Button', Button)
app.component('Card', Card)
app.component('FileUpload', FileUpload)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Message', Message)
app.component('Tag', Tag)
app.component('MenuBar', MenuBar)
app.component('Breadcrumb', Breadcrumb)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('Paginator', Paginator)

app.mount('#app')
