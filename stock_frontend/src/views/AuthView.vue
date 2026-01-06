<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import welcomeBgAsset from '@/assets/welcome_bg.png';

const welcomeBg = welcomeBgAsset;

const isLogin = ref(true);
const registrationSuccess = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;
  try {
    if (!isLogin.value) {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        loading.value = false;
        return;
      }
      await authStore.register(email.value, password.value);
      registrationSuccess.value = true;
    } else {
      await authStore.login(email.value, password.value);
      router.push('/dashboard');
    }
  } catch {
    error.value = authStore.error || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-img :src="welcomeBg" cover class="fill-height">
    <div class="overlay"></div>
    <v-container fluid class="fill-height pa-0" style="position: relative;">
      <v-row no-gutters class="fill-height">
        <!-- Info Column -->
        <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center pa-10 pl-16 text-center text-white">
          <div>
            <v-icon size="64" class="mb-4">mdi-finance</v-icon>
            <h2 class="text-h4 font-weight-bold mb-4">Odkryj Finansowe Spostrzeżenia</h2>
            <p class="text-subtitle-1">
              Dołącz do nas, aby uzyskać dostęp do analityki predykcyjnej i interpretacji rynkowych opartych na AI.
            </p>
          </div>
        </v-col>
        
        <!-- Form Column -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center">
          <v-card class="glowing-card pa-4" width="100%" max-width="400px">
            <v-card-title class="text-center text-h5 mb-4">{{ registrationSuccess ? 'Rejestracja Udana!' : (isLogin ? 'Witaj Ponownie' : 'Utwórz Konto') }}</v-card-title>
            <v-card-text v-if="registrationSuccess" class="text-center">
               <v-icon color="success" size="64" class="mb-4">mdi-email-check</v-icon>
               <p class="text-body-1 mb-4">
                 Wysłaliśmy link aktywacyjny na Twój adres email: <strong>{{ email }}</strong>.
                 Sprawdź swoją skrzynkę (i folder spam), aby aktywować konto.
               </p>
               <v-btn color="primary" variant="text" @click="registrationSuccess = false; isLogin = true">Wróć do logowania</v-btn>
            </v-card-text>
            <v-card-text v-else>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-inner-icon="mdi-email-outline"
                  type="email"
                  v-model="email"
                  required
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="Hasło"
                  name="password"
                  prepend-inner-icon="mdi-lock-outline"
                  type="password"
                  v-model="password"
                  required
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-if="!isLogin"
                  id="confirm-password"
                  label="Potwierdź Hasło"
                  name="confirm-password"
                  prepend-inner-icon="mdi-lock-outline"
                  type="password"
                  v-model="confirmPassword"
                  required
                  variant="outlined"
                ></v-text-field>
                <p v-if="error" class="text-error text-caption mb-4">
                  {{ error }}
                </p>
                <v-btn :loading="loading" color="primary" block size="large" @click="handleSubmit">{{ isLogin ? 'Zaloguj' : 'Zarejestruj' }}</v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <span @click="isLogin = !isLogin" class="cursor-pointer span-btn">{{ isLogin ? 'Potrzebujesz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się' }}</span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface-overlay-light);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glowing-card {
  background-color: var(--color-surface-transparent) !important;
  box-shadow: var(--shadow-glow-primary);
  border-radius: 16px !important;
}
</style>
