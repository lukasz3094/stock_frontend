import { defineStore } from 'pinia';
import axios from 'axios';
import type { Router } from 'vue-router';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  token: string | null;
  error: string | null;
  router: any | null; // Changed to any to resolve type incompatibility
}

interface ErrorDetail {
  msg: string;
  type: string;
  loc: string[];
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    error: null,
    router: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setRouter(router: Router) {
      this.router = router;
    },
    async register(email: string, password: string) {
      this.error = null;
      try {
        await axios.post(`${API_URL}/api/v1/register`, {
          email,
          password,
        });
        await this.login(email, password);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (Array.isArray(error.response?.data?.detail)) {
            this.error = (error.response.data.detail as ErrorDetail[]).map((err) => err.msg).join('; ');
          } else {
            this.error = error.response?.data?.detail || 'An error occurred during registration.';
          }
        } else {
          this.error = 'An unexpected error occurred during registration.';
        }
        throw error;
      }
    },
    async login(email: string, password: string) {
      this.error = null;
      try {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        const response = await axios.post(`${API_URL}/api/v1/login`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        const { access_token } = response.data;
        this.token = access_token;
        localStorage.setItem('token', access_token);
        
        if (this.router) {
          this.router.push('/dashboard');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (Array.isArray(error.response?.data?.detail)) {
            this.error = (error.response.data.detail as ErrorDetail[]).map((err) => err.msg).join('; ');
          } else {
            this.error = error.response?.data?.detail || 'An error occurred during login.';
          }
        } else {
          this.error = 'An unexpected error occurred during login.';
        }
        throw error;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      if (this.router) {
        this.router.push('/login');
      }
    },
  },
});
