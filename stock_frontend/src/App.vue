<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Stock App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authStore.isAuthenticated" text to="/login">Login</v-btn>
      <v-btn v-else text @click="authStore.logout()">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
