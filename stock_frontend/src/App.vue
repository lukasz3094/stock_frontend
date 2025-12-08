<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import logo from '@/assets/logo.png';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const drawer = ref(false);

const showAppBar = computed(() => {
  return authStore.isAuthenticated && route.name !== 'welcome' && route.name !== 'login';
});

const logout = () => {
  authStore.logout();
  router.push('/welcome');
};
</script>

<template>
  <v-app>
    <v-app-bar v-if="showAppBar" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img :src="logo" max-height="50" max-width="50" contain></v-img>
      <v-toolbar-title>Apex Predictions</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="showAppBar" v-model="drawer" app>
      <v-list>
        <v-list-item to="/dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

