
<script setup lang="ts">
import { ref } from 'vue';
import CompanyList from '@/components/CompanyList.vue';
import StockChart from '@/components/StockChart.vue';
import { useCompaniesStore } from '@/stores/companies';

const companiesStore = useCompaniesStore();

const selectedForecasts = ref(['LSTM']); // Default to LSTM
const forecastOptions = ['ARIMA', 'LSTM'];

const toggleForecast = (forecast: string) => {
  const index = selectedForecasts.value.indexOf(forecast);
  if (index > -1) {
    if (selectedForecasts.value.length > 1) {
      selectedForecasts.value.splice(index, 1);
    }
  } else {
    selectedForecasts.value.push(forecast);
  }
};
</script>

<template>
  <div class="dashboard-container">
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col cols="12" md="3">
          <v-card class="glowing-card fill-height">
            <CompanyList />
          </v-card>
        </v-col>
        <v-col cols="12" md="9" class="fill-height">
          <v-card class="glowing-card fill-height d-flex align-center justify-center">
            <div v-if="!companiesStore.selectedTicker" class="text-center">
              <v-icon size="64" class="mb-4">mdi-chart-line</v-icon>
              <h2 class="text-h5">Wybierz spółkę, aby zobaczyć wykres</h2>
            </div>
            <div v-else class="d-flex flex-column fill-height" style="width: 100%;">              
                <StockChart
                  :ticker="companiesStore.selectedTicker"
                  :companyName="companiesStore.selectedCompanyName"
                  :selectedForecasts="selectedForecasts"
                  :forecastOptions="forecastOptions"
                  :toggleForecast="toggleForecast"
                />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style scoped>
.dashboard-container {
  background: var(--color-background);
  height: calc(100vh - 64px);
}

.glowing-card {
  background-color: var(--color-surface-transparent) !important;
  box-shadow: var(--shadow-glow-primary);
  border-radius: 16px !important;
  border: 1px solid var(--color-border-primary-subtle);
  width: 100%;
}

</style>
