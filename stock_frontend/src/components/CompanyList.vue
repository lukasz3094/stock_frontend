<template>
  <div class="company-list-container">
    <div class="pa-2 d-flex justify-center flex-wrap gap-2">
      <v-btn
        v-for="value in store.timeFrameValues"
        :key="value"
        size="small"
        outlined
        @click="store.setTimeframe(value as Timeframe)"
        :class="{ 'btn-active': store.selectedTimeframe === value }"
        class="pa-2 ma-1"
      >
        {{ value }}
      </v-btn>
    </div>

    <v-list
      :selected="[store.selectedTicker]"
      @update:selected="onCompanySelect"
      color="primary"
      bg-color="transparent"
    >
      <v-list-item
        v-for="company in store.companies"
        :key="company.ticker"
        :value="company.ticker"
      >
        <v-list-item-title>{{ company.ticker }} - {{ company.name }}</v-list-item-title>
        <v-list-item-subtitle :class="priceChangeColor(company.price_change)">
          {{ formatPrice(company.current_price) }}
          <v-icon>{{ priceChangeIcon(company.price_change) }}</v-icon>
          <span v-if="company.price_change !== null && company.price_change !== 0">
            {{ formatPriceChange(company.price_change) }} ({{ company.price_change_percent?.toFixed(2) }}%)
          </span>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCompaniesStore, type Timeframe } from '@/stores/companies';

const store = useCompaniesStore();    

onMounted(() => {
  store.fetchCompanies();
});

const onCompanySelect = (selection: (string | null)[]) => {
  if (selection.length > 0) {
    const selected = selection[0];
    if (selected) {
      store.selectCompany(selected);
    }
  }
};

const formatPrice = (price: number | null) => {
  if (price === null) return '-';
  return price.toFixed(2);
};

const formatPriceChange = (change: number | null) => {
  if (change === null) return '';
  const fixed2 = change.toFixed(2);
  if (fixed2 === '0.00' || fixed2 === '-0.00') {
    return change.toFixed(3);
  }
  return fixed2;
};

const priceChangeColor = (change: number | null) => {
  if (change === null || change === 0) return 'text-stock-grey';
  return change > 0 ? 'text-stock-green' : 'text-stock-red';
};

const priceChangeIcon = (change: number | null) => {
  if (change === null || change === 0) return '';
  return change > 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
};
</script>

<style scoped>
.company-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-btn:hover {
  filter: brightness(0.9);
  transition: filter 0.2s ease;
}

.d-flex.flex-wrap.gap-2 {
  row-gap: 8px;
}

</style>
