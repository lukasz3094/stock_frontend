<template>
  <div>
    <v-btn @click="getInterpretation" :loading="loading" v-if="!interpretation && !loading"
           color="primary" class="mt-4">
      Get Interpretation
    </v-btn>
    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto mt-4"></v-progress-circular>
    <div v-if="interpretation" v-html="interpretation" class="interpretation-text"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getInterpretation as fetchInterpretation } from '@/services/interpretation_api';
import { marked } from 'marked';

const props = defineProps<{
  symbol: string | null;
  selectedForecasts: string[];
}>();

const loading = ref(false);
const interpretation = ref('');
const abortController = ref<AbortController | null>(null);

const getInterpretation = async () => {
  if (!props.symbol) {
    loading.value = false;
    return;
  }

  loading.value = true;
  interpretation.value = '';
  let fullInterpretation = '';

  if (abortController.value) {
    abortController.value.abort();
  }

  abortController.value = new AbortController();

  try {
    const response = await fetchInterpretation(props.symbol, props.selectedForecasts, abortController.value);

    if (!response.ok) {
      loading.value = false;
      interpretation.value = '<p>Failed to fetch interpretation.</p>';
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      const read = async () => {
        const { done, value } = await reader.read();
        if (done) {
          loading.value = false;
          const firstSentence = fullInterpretation.split('.')[0] + '.';
          interpretation.value = await marked(firstSentence);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullInterpretation += chunk;
        read();
      };
      read();
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      interpretation.value = '<p>Failed to fetch interpretation.</p>';
    }
    loading.value = false;
  }
};

const resetInterpretation = () => {
  interpretation.value = '';
  loading.value = false;
  if (abortController.value) {
    abortController.value.abort();
  }
};

defineExpose({
  resetInterpretation,
});
</script>

<style scoped>
.interpretation-text {
  margin-top: 16px;
  padding: 12px;
  background-color: #1E1E1E;
  border-radius: 4px;
  color: #D1D4DC;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
