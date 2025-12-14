
<script setup lang="ts">
import { ref } from 'vue';
import CompanyList from '@/components/CompanyList.vue';
import StockChart from '@/components/StockChart.vue';

const selectedTicker = ref<string | null>(null);
const selectedCompanyName = ref<string | null>(null);

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

const onCompanySelected = ({ ticker, name }: { ticker: string, name: string }) => {
  selectedTicker.value = ticker;
  selectedCompanyName.value = name;
};

</script>

<template>
  <div class="dashboard-container">
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col cols="12" md="3">
          <v-card class="glowing-card fill-height">
            <CompanyList @company-selected="onCompanySelected" />
          </v-card>
        </v-col>
        <v-col cols="12" md="9" class="fill-height">
                                <v-card class="glowing-card fill-height d-flex align-center justify-center">
                                            <div v-if="!selectedTicker" class="text-center">
                                              <v-icon size="64" class="mb-4">mdi-chart-line</v-icon>
                                              <h2 class="text-h5">Wybierz spółkę, aby zobaczyć wykres</h2>
                                            </div>
                                            <div v-else class="d-flex flex-column fill-height" style="width: 100%;">
                                                <h2 class="text-h5 text-center my-4 company-name-display">{{ selectedCompanyName }} ({{ selectedTicker }})</h2>
                                                <StockChart
                                                  :ticker="selectedTicker"
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
  background: #121212;
  height: calc(100vh - 64px); /* Assuming app bar height is 64px */
}

.glowing-card {
  background-color: rgba(30, 30, 30, 0.6) !important;
  box-shadow: 0 0 20px 5px rgba(0, 200, 255, 0.2);
  border-radius: 16px !important;
  border: 1px solid rgba(0, 200, 255, 0.3);
  width: 100%;
}

.company-name-display {
  color: #64B5F6; /* Cool blue color */
}
</style>
