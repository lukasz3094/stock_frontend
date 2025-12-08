
<template>
  <div class="dashboard-container">
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col cols="12" md="3">
          <v-card class="glowing-card fill-height">
            <CompanyList @company-selected="onCompanySelected" />
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-card class="glowing-card fill-height d-flex align-center justify-center">
            <div v-if="!selectedTicker" class="text-center">
              <v-icon size="64" class="mb-4">mdi-chart-line</v-icon>
              <h2 class="text-h5">Wybierz spółkę, aby zobaczyć wykres</h2>
            </div>
            <StockChart v-else :ticker="selectedTicker" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CompanyList from '@/components/CompanyList.vue';
import StockChart from '@/components/StockChart.vue';

const selectedTicker = ref<string | null>(null);

const onCompanySelected = (ticker: string) => {
  selectedTicker.value = ticker;
};
</script>

<style scoped>
.dashboard-container {
  background: #121212;
  height: calc(100vh - 64px); /* Assuming app bar height is 64px */
}

.glowing-card {
  background-color: rgba(30, 30, 30, 0.6) !important;
  box-shadow: 0 0 20px 5px rgba(0, 200, 255, 0.2);
  border-radius: 16px !important;
  border: 1px solid rgba(0, 200, 255, 0.3);
}
</style>
