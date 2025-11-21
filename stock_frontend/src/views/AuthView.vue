<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ isLogin ? 'Login' : 'Register' }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="email"
                v-model="email"
                required
              ></v-text-field>
              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
                required
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                id="confirm-password"
                label="Confirm Password"
                name="confirm-password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="confirmPassword"
                required
              ></v-text-field>
              <v-alert v-if="error" type="error" dense>
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="isLogin = !isLogin">{{ isLogin ? 'Register' : 'Login' }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleSubmit">{{ isLogin ? 'Login' : 'Register' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  error.value = null;
  try {
    if (!isLogin.value) {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
      }
      await authStore.register(email.value, password.value);
    } else {
      await authStore.login(email.value, password.value);
    }
    router.push('/');
  } catch {
    error.value = authStore.error;
  }
};
</script>

<style scoped>
</style>
