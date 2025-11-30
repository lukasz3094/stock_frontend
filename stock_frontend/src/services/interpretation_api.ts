import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const getInterpretation = async (symbol: string, abortController: AbortController) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  const response = await fetch(`${API_URL}/api/v1/interpret/${symbol}`, {
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
