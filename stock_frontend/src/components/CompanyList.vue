<template>
  <v-list v-model:selected="selected" color="primary" bg-color="transparent">
    <v-list-item
      v-for="company in companies"
      :key="company.ticker"
      :value="company.ticker"
    >
      <v-list-item-title>{{ company.ticker }} - {{ company.name }}</v-list-item-title>
      <v-list-item-subtitle :class="priceChangeColor(company.price_change)">
        {{ formatPrice(company.current_price) }}
        <v-icon>{{ priceChangeIcon(company.price_change) }}</v-icon>
        <span v-if="company.price_change !== null && company.price_change !== 0">
          ({{ company.price_change.toFixed(2) }}$)
        </span>
      </v-list-item-subtitle>    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getCompanies } from '@/services/company_api'; 

interface Company {
  name: string;
  ticker: string;
  current_price: number | null;
  price_change: number | null;
}

const companies = ref<Company[]>([]);
const selected = ref<string[]>([]);
const emit = defineEmits(['company-selected']);

onMounted(async () => {
  try {
    companies.value = await getCompanies();
    if (companies.value.length > 0 && companies.value[0]) {
      selected.value = [companies.value[0].ticker];
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
  }
});

watch(selected, (newValue) => {
  if (newValue.length > 0) {
    emit('company-selected', newValue[0]);
  }
});

const formatPrice = (price: number | null) => {
  if (price === null) return '-';
  return price.toFixed(2);
};

const priceChangeColor = (change: number | null) => {
  if (change === null || change === 0) return 'text-grey';
  return change > 0 ? 'text-green' : 'text-red';
};

const priceChangeIcon = (change: number | null) => {
  if (change === null || change === 0) return '';
  return change > 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
};
</script>
