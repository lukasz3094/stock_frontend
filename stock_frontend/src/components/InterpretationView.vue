<template>
  <div>
    <div v-if="isInterpretationVisible" class="floating-interpretation-container">
      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-4"></v-progress-circular>

      <div v-if="interpretation" v-html="interpretation" class="pa-2 text-wrap text-md-body-2"></div>

      <div v-if="interpretation" class="d-flex direction-horizontal align-end justify-space-between">
        <button class="btn-refresh">
          <v-icon small @click="getInterpretation" class="mt-2">mdi-refresh</v-icon>
        </button>

        <div class="text-end text-disabled text-sm-caption">{{ interpretationTime }}</div>
      </div>
    </div>

    <button :class="[isInterpretationVisible ? 'btn-chat-selected' : '', 'btn-chat']" @click="switchInterpretationView">
      <v-icon>mdi-robot</v-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getInterpretation as fetchInterpretation } from '@/services/interpretation_api';
import { marked } from 'marked';

const props = defineProps<{
  symbol: string | null;
  selectedForecasts: string[];
}>();

const loading = ref(false);
const interpretation = ref('');
const interpretationSymbol = ref('');
const interpretationTime = ref('');
const isInterpretationVisible = ref<boolean>(false);
const abortController = ref<AbortController | null>(null);

const getInterpretation = async () => {
  if (!props.symbol) {
    loading.value = false;
    return;
  }

  loading.value = true;
  interpretation.value = '';
  interpretationSymbol.value = props.symbol || '';
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
      interpretationTime.value = new Date().toLocaleTimeString();

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
  interpretationSymbol.value = '';
  if (abortController.value) {
    abortController.value.abort();
  }
};

const switchInterpretationView = () => {
  isInterpretationVisible.value = !isInterpretationVisible.value;

  if (isInterpretationVisible.value && !interpretation.value) {
    getInterpretation();
  }
};

defineExpose({
  resetInterpretation,
});

watch(() => props.symbol, () => {
  if (isInterpretationVisible.value && props.symbol !== interpretationSymbol.value) {
    switchInterpretationView();
  }
});
</script>

<style scoped>

.btn-chat {
  background-color: var(--color-surface-transparent) !important;
  color: var(--color-primary) !important;
  box-shadow: 0 0 8px var(--color-primary-accent) !important;
  transition: all 0.2s ease !important;
  height: 34px !important;
  aspect-ratio: 1 / 1 !important;
  padding: 0 !important;
  border-radius: 50% !important;
}

.btn-chat-selected {
  background-color: var(--color-primary) !important;
  color: var(--color-background) !important;
  box-shadow: 0 0 8px var(--color-primary-accent) !important;
}


.btn-chat:hover {
  box-shadow: 0 0 12px var(--color-primary-accent) !important;
}

.btn-refresh {
  height: 32px;
  aspect-ratio: 1 / 1;
  border-radius: 50% !important;
}

.btn-refresh:hover {
  box-shadow: 0 0 12px var(--color-primary-accent) !important;
}

.floating-interpretation-container {
  position: absolute;
  top: 0;
  right: 48px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: var(--color-surface);
  box-shadow: 0 4px 12px var(--color-primary-accent);
  border-radius: 8px;
  padding: 12px;
  z-index: 10;
}

</style>
