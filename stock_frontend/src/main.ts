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
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#00C8FF',    // A vibrant, electric blue
    secondary: '#B0BEC5',  // A light grey for softer accents
    error: '#E53935',
    info: '#2196F3',
    success: '#00C853',
    warning: '#FFB300',
  }
};

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
