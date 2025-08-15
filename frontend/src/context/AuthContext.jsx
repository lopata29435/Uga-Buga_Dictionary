import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextBase';
import axios from 'axios';
import config from '../config/api.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Инициализация токенов из localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUsername = localStorage.getItem('username');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser({ username: storedUsername, authenticated: true });
    }

    setLoading(false);
  }, []);

  // logout вынесен вверх и мемоизирован, чтобы можно было безопасно добавить в зависимости
  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await axios.post(`${config.API_URL}${config.endpoints.auth.logout}`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
    }
  }, [refreshToken]);

  // Настройка axios interceptor для автоматического добавления токена
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (reqConfig) => { // переименовали во избежание тени переменной config
        const token = accessToken || localStorage.getItem('accessToken');
        if (token) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && refreshToken) {
          try {
            const response = await axios.post(`${config.API_URL}${config.endpoints.auth.refresh}`, { refreshToken });
            const newAccessToken = response.data.accessToken;
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios.request(error.config);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout]);

  const login = async (username, password) => {
    const { data } = await axios.post(`${config.API_URL}${config.endpoints.auth.login}`, { username, password });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser({ username, authenticated: true });
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('username', username);
    return data;
  };

  const register = async (username, password) => {
    const { data } = await axios.post(`${config.API_URL}${config.endpoints.auth.register}`, { username, password });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser({ username, authenticated: true });
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('username', username);
    return data;
  };

  const value = { user, accessToken, login, register, logout, loading, isAuthenticated: !!accessToken };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
