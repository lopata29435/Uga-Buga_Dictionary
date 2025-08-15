import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Словарь Уга-Бунга
        </Link>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Главная
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/dictionary"
                  className={location.pathname === '/dictionary' ? 'active' : ''}
                >
                  Словарь
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className={location.pathname === '/search' ? 'active' : ''}
                >
                  Поиск
                </Link>
              </li>
              <li>
                <Link
                  to="/add-word"
                  className={location.pathname === '/add-word' ? 'active' : ''}
                >
                  Добавить слово
                </Link>
              </li>
            </>
          )}
          {!isAuthenticated ? (
            <li>
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Войти
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Выйти ({user?.username || localStorage.getItem('username')})
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
