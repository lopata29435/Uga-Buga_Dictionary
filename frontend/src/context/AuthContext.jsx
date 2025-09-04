import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config/api.js';
import { AuthContext } from './AuthContextBase';

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

  // logout без навигации - навигация будет обрабатываться в компонентах
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
    let isRefreshing = false; // Флаг для предотвращения множественных попыток обновления
    let failedQueue = []; // Очередь неудачных запросов

    const processQueue = (error, token = null) => {
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });

      failedQueue = [];
    };

    const requestInterceptor = axios.interceptors.request.use(
      (reqConfig) => {
        // Не добавляем Authorization заголовок для запросов на обновление токена
        if (reqConfig.url?.includes('/auth/refresh')) {
          return reqConfig;
        }

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
        const originalRequest = error.config;

        // Проверяем, что это 401 ошибка, есть refresh token, и это не запрос на обновление токена
        if (error.response?.status === 401 &&
            refreshToken &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')) {

          if (isRefreshing) {
            // Если уже идет процесс обновления, добавляем запрос в очередь
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            console.log('Attempting to refresh token...');
            // Создаем отдельный запрос без interceptor'ов для обновления токена
            const response = await axios.create().post(`${config.API_URL}${config.endpoints.auth.refresh}`, {
              refreshToken
            });

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            // КРИТИЧЕСКИ ВАЖНО: Обновляем состояние React СИНХРОННО
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);

            // Обновляем refresh token если сервер вернул новый
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Обновляем пользователя в состоянии - ПРИНУДИТЕЛЬНО
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
              setUser({ username: storedUsername, authenticated: true });
            }

            // Обновляем заголовок в оригинальном запросе
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Обрабатываем очередь ожидающих запросов
            processQueue(null, newAccessToken);

            console.log('Token refreshed successfully, user should remain authenticated');

            // Принудительно вызываем setState чтобы компоненты обновились
            setLoading(false);
            setLoading(true);
            setLoading(false);

            // Повторяем оригинальный запрос
            return axios(originalRequest);

          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Обрабатываем очередь с ошибкой
            processQueue(refreshError, null);

            // Выполняем logout если refresh token действительно недействителен
            if (refreshError.response?.status === 401) {
              console.log('Refresh token expired, logging out...');
              await logout();
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
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
