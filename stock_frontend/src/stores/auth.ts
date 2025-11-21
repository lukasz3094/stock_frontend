import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(email: string, password: string) {
      this.error = null;
      try {
        await axios.post(`${API_URL}/register`, {
          email,
          password,
        });
        // After successful registration, automatically log in the user
        await this.login(email, password);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.detail || 'An error occurred during registration.';
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
        
        const response = await axios.post(`${API_URL}/login`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        const { access_token } = response.data;
        this.token = access_token;
        localStorage.setItem('token', access_token);
        
        // You might want to redirect the user to a different page
        // For example, using the router instance
        // this.router.push('/'); 
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.detail || 'An error occurred during login.';
        } else {
          this.error = 'An unexpected error occurred during login.';
        }
        throw error;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      // You might want to redirect the user to the login page
      // this.router.push('/auth');
    },
  },
});
