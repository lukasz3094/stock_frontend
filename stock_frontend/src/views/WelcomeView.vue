<script setup lang="ts">
import welcomeBgAsset from '@/assets/welcome_bg.png';

const welcomeBg = welcomeBgAsset;
</script>
<template>
  <v-container fluid class="fill-height pa-0">
    <v-img
      :src="welcomeBg"
      cover
      class="align-center"
      style="height: 100vh; width: 100vw;"
    >
      <div class="overlay"></div> <!-- For dimming the image -->
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="glass-content">
            <h1 class="text-h2 font-weight-bold mb-4 text-white">
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
    </v-img>
  </v-container>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
}

.glass-content {
  background: rgba(22, 22, 22, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 40px;
  position: relative;
  z-index: 1;
}
</style>
