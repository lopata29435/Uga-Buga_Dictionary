import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuthHook';

// Хук для автоматического перенаправления при logout
export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Если пользователь был авторизован, но токены были очищены (logout)
    // и мы не на главной или публичных страницах - перенаправляем на главную
    if (!isAuthenticated && !user) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/public-dictionary'];

      // Если мы на защищенной странице и произошел logout
      if (!publicPaths.includes(currentPath)) {
        console.log('Session expired, redirecting to home page...');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);
};
