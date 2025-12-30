<script setup lang="ts">
import welcomeBgAsset from '@/assets/welcome_bg.png';

const welcomeBg = welcomeBgAsset;
</script>
<template>
  <v-container fluid class="fill-height fill-width pa-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="10" lg="8" class="text-center">
        <div class="glass-content">
          <h1 class="text-h2 font-weight-bold mb-4 text-white text-break">
            Odkryj Przyszłość Inwestycji z AI
          </h1>
          <p class="text-h6 font-weight-light mb-8 text-white">
            Analizuj, przewiduj i inwestuj z pewnością siebie, wykorzystując moc sztucznej inteligencji.
          </p>
          <v-btn color="primary" size="large" to="/login">
            Rozpocznij
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-img
      :src="welcomeBg"
      cover
      class="align-center background-image"
    >
    </v-img>
  </v-container>
</template>

<style scoped>

.glass-content {
  background: var(--color-surface-overlay-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid var(--color-border-white-faint);
  padding: 40px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 30px rgba(0, 0, 0, 0.8));
}

.background-image {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(4px);
  filter: blur(4px) brightness(0.5);
}
</style>
