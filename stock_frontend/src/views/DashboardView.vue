<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <CompanyList @company-selected="onCompanySelected" />
      </v-col>
      <v-col cols="9">
        <StockChart :ticker="selectedTicker" />
      </v-col>
    </v-row>
  </v-container>
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
