import { defineStore } from 'pinia';
import { getCompanies, getCompanyHistory, getPredictions } from '@/services/company_api';
import type { HistoryDataItem, DashboardData } from '@/types/chart';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | 'MAX';

export interface Company {
  name: string;
  ticker: string;
  current_price: number | null;
  price_change: number | null;
  price_change_percent?: number | null;
}

interface CompaniesState {
  companies: Company[];
  selectedTicker: string | null;
  selectedCompanyName: string | null;
  timeFrameValues: Timeframe[];
  selectedTimeframe: Timeframe;
  loading: boolean;
  error: string | null;
  historyData: HistoryDataItem[];
  predictions: DashboardData | null;
  chartLoading: boolean;
  chartError: string | null;
}

export const useCompaniesStore = defineStore('companies', {
  state: (): CompaniesState => ({
    companies: [],
    selectedTicker: null,
    selectedCompanyName: null,
    timeFrameValues: ['1D', '5D', '1M', '6M', 'YTD', '1Y', 'MAX'] as Timeframe[],
    selectedTimeframe: '1D',
    loading: false,
    error: null,
    historyData: [],
    predictions: null,
    chartLoading: false,
    chartError: null,
  }),
  actions: {
    async fetchCompanies() {
      this.loading = true;
      this.error = null;
      try {
        const companiesData: Company[] = await getCompanies(this.selectedTimeframe);
        
        this.companies = companiesData.map(company => {
          let percent = null;
          if (company.current_price !== null && company.price_change !== null) {
            const pastPrice = company.current_price - company.price_change;
            if (pastPrice !== 0) {
              percent = (company.price_change / pastPrice) * 100;
            }
          }
          return {
            ...company,
            price_change_percent: percent
          };
        });
        
        if (!this.selectedTicker && this.companies.length > 0 && this.companies[0]) {
          this.selectCompany(this.companies[0].ticker);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        this.error = 'Failed to load companies';
      } finally {
        this.loading = false;
      }
    },
    async fetchChartData() {
      if (!this.selectedTicker) return;
      
      this.chartLoading = true;
      this.chartError = null;
      try {
        const [history, predictions] = await Promise.all([
          getCompanyHistory(this.selectedTicker),
          getPredictions(this.selectedTicker)
        ]);
        this.historyData = history;
        this.predictions = predictions;
      } catch (error) {
        console.error('Error fetching chart data:', error);
        this.chartError = 'Failed to load chart data';
      } finally {
        this.chartLoading = false;
      }
    },
    selectCompany(ticker: string) {
      this.selectedTicker = ticker;
      const company = this.companies.find((c) => c.ticker === ticker);
      if (company) {
        this.selectedCompanyName = company.name;
      }
      this.fetchChartData();
    },
    setTimeframe(timeframe: Timeframe) {
      this.selectedTimeframe = timeframe;
      this.fetchCompanies();
    },
  },
  getters: {
    //
  }
});
