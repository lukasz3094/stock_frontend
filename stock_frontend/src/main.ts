import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const stockDarkTheme = {
  dark: true,
  colors: {
    background: '#1a222f',
    surface: '#232f3e',
    primary: '#4caf50', // Green for success
    secondary: '#03a9f4', // Light blue for accents
    error: '#f44336', // Red for errors/loss
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffc107',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'stockDarkTheme',
    themes: {
      stockDarkTheme,
    },
  },
})

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()
authStore.setRouter(router)

app.use(router)
app.use(vuetify)

app.mount('#app')
