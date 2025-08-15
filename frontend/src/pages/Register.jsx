import React, { useState } from 'react';
import ProfileSection from '../components/ProfileSection';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.password);
      navigate('/dictionary');
    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProfileSection
        name="Угук Мудрый"
        subtitle="Станьте частью великого племени"
      />

      <div className="page-container">
        <h1 className="page-title">🦴 Присоединиться к племени</h1>

        <div className="form-container">
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1))',
            borderRadius: '10px',
            border: '2px solid rgba(139, 69, 19, 0.3)'
          }}>
            <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>🌟 Добро пожаловать в племя Уга-Бунга!</h3>
            <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
              Зарегистрируйтесь, чтобы получить полный доступ к древнему словарю
              и стать хранителем мудрости племени Уга-Бунга
            </p>
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #ef5350',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">👤 Выберите племенное имя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Придумайте уникальное имя (минимум 3 символа)"
                minLength="3"
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Имя должно содержать минимум 3 символа
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password">🔑 Создайте тайное слово</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Надежный пароль (минимум 6 символов)"
                minLength="6"
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Пароль должен содержать минимум 6 символов
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">🔐 Повторите тайное слово</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Повторите пароль для подтверждения"
                minLength="6"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <small style={{ color: '#c62828', fontSize: '0.8rem' }}>
                  Пароли не совпадают
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading || formData.password !== formData.confirmPassword}
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                cursor: (loading || formData.password !== formData.confirmPassword) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '🔄 Вступаем в племя...' : '🦴 Стать частью племени'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            borderTop: '1px solid #eee'
          }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Уже состоите в племени?
            </p>
            <Link
              to="/login"
              style={{
                color: '#8B4513',
                textDecoration: 'none',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                border: '2px solid #8B4513',
                borderRadius: '8px',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#8B4513';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#8B4513';
              }}
            >
              🔥 Войти в пещеру
            </Link>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '10px',
            border: '2px solid rgba(76, 175, 80, 0.3)'
          }}>
            <h4 style={{ color: '#4CAF50', marginBottom: '1rem' }}>🎯 Что вы получите:</h4>
            <ul style={{ color: '#666', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li>📖 Полный доступ к словарю Уга-Бунга</li>
              <li>🔍 Возможность поиска по всем словам</li>
              <li>➕ Право добавлять новые слова в словарь</li>
              <li>✏️ Редактирование и управление словами</li>
              <li>🦴 Звание "Хранитель древней мудрости"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
