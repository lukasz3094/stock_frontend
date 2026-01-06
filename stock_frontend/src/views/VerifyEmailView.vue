<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import welcomeBgAsset from '@/assets/welcome_bg.png';

const route = useRoute();
const router = useRouter();
const welcomeBg = welcomeBgAsset;
const API_URL = import.meta.env.VITE_API_URL;

const loading = ref(true);
const success = ref(false);
const message = ref('');

onMounted(async () => {
  const token = route.query.token as string;
  if (!token) {
    loading.value = false;
    success.value = false;
    message.value = 'Brak tokenu weryfikacyjnego.';
    return;
  }

  try {
    await axios.get(`${API_URL}/api/v1/verify-email`, {
      params: { token }
    });
    success.value = true;
    message.value = 'Twoje konto zostało pomyślnie zweryfikowane!';
  } catch (error: any) {
    success.value = false;
    message.value = error.response?.data?.detail || 'Wystąpił błąd podczas weryfikacji.';
  } finally {
    loading.value = false;
  }
});

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <v-img :src="welcomeBg" cover class="fill-height">
    <div class="overlay"></div>
    <v-container fluid class="fill-height pa-0" style="position: relative;">
      <v-row no-gutters class="fill-height justify-center align-center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="glowing-card pa-6 text-center">
            <v-card-title class="text-h5 mb-4">Weryfikacja Konta</v-card-title>
            
            <v-card-text v-if="loading">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-4">Weryfikowanie...</p>
            </v-card-text>
            
            <v-card-text v-else>
              <v-icon :color="success ? 'success' : 'error'" size="64" class="mb-4">
                {{ success ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
              </v-icon>
              <p class="text-h6 mb-4">{{ message }}</p>
              <v-btn color="primary" @click="goToLogin">Przejdź do logowania</v-btn>
            </v-card-text>
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
