import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const getInterpretation = async (symbol: string, modelNames: string[], abortController: AbortController) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  const params = new URLSearchParams();
  modelNames.forEach(model => params.append('model_names', model.toLowerCase())); // Ensure lowercase for enum

  const url = `${API_URL}/api/v1/interpret/${symbol}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    signal: abortController.signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch interpretation');
  }

  return response;
};
