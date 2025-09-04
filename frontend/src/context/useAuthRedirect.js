import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuthHook';

// Хук для автоматического перенаправления при logout
export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    // Запоминаем первоначальное состояние авторизации
    if (isAuthenticated && user) {
      wasAuthenticated.current = true;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Перенаправляем только если пользователь БЫЛ авторизован, но стал неавторизованным
    // Это означает что произошел logout (автоматический или ручной)
    if (wasAuthenticated.current && !isAuthenticated && !user) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/public-dictionary'];

      // Если мы на защищенной странице и произошел logout
      if (!publicPaths.includes(currentPath)) {
        console.log('Session expired, redirecting to home page...');
        navigate('/', { replace: true });
        wasAuthenticated.current = false; // Сбрасываем флаг
      }
    }
  }, [isAuthenticated, user, navigate]);
};
