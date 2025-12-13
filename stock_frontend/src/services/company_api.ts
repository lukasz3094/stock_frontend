import type { DashboardData } from '@/types/chart';
import apiClient from './api';

export const getCompanies = async () => {
  const response = await apiClient.get('/companies');
  return response.data;
};

export const getCompanyHistory = async (ticker: string) => {
  const response = await apiClient.get(`/companies/${ticker}/history`);
  return response.data;
};

export const getPredictions = async (ticker: string): Promise<DashboardData> => {
  const response = await apiClient.get(`/predictions/${ticker}`);
  return response.data;
};
