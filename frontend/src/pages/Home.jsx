import React from 'react';
import ProfileSection from '../components/ProfileSection';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <ProfileSection
        name="Администратор (Главный Вахтанг)"
        subtitle="Словарь языка Уга-Бунга"
      />

      <div className="page-container">
        <h1 className="page-title">Словарь Уга-Бунга</h1>

        <div className="page-content">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '3rem', color: '#1f2937' }}>
            Персональный словарь вымышленного языка для изучения и практики
          </p>

          {!isAuthenticated ? (
            <div style={{
              textAlign: 'center',
              background: 'rgba(62, 180, 137, 0.05)',
              padding: '2.5rem',
              borderRadius: '12px',
              marginBottom: '3rem',
              border: '1px solid rgba(62, 180, 137, 0.2)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#1f2937', fontSize: '1.3rem' }}>Вход в систему</h3>
              <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                Войдите для доступа к полному функционалу словаря
              </p>
              <Link
                to="/login"
                className="btn"
                style={{
                  textDecoration: 'none',
                  display: 'inline-block',
                  width: 'auto',
                  padding: '0.8rem 2rem'
                }}
              >
                Войти
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <Link
                  to="/dictionary"
                  className="btn"
                  style={{
                    textDecoration: 'none',
                    width: 'auto',
                    padding: '0.8rem 2rem'
                  }}
                >
                  Открыть словарь
                </Link>
                <Link
                  to="/search"
                  className="btn"
                  style={{
                    textDecoration: 'none',
                    width: 'auto',
                    padding: '0.8rem 2rem'
                  }}
                >
                  Поиск
                </Link>
                <Link
                  to="/add-word"
                  className="btn"
                  style={{
                    textDecoration: 'none',
                    width: 'auto',
                    padding: '0.8rem 2rem'
                  }}
                >
                  Добавить слово
                </Link>
              </div>
            </div>
          )}

          <div className="cards-container">
            <div className="card">
              <h3 className="card-title">Просмотр словаря</h3>
              <p className="card-content">
                Просматривайте все слова с переводами и примерами использования, просвещайтесь в культуру Вахтанговны
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Быстрый поиск</h3>
              <p className="card-content">
                Находите нужные слова по названию или переводу
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Управление</h3>
              <p className="card-content">
                Добавляйте новые слова и редактируйте существующие, зовите друзей(мы не секта)
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Сила в Уга-Буге</h3>
              <p className="card-content">
                Чем больше слов вы добавите, тем богаче станет ваш словарь и культура Вахтанговны
              </p>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(62, 180, 137, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(62, 180, 137, 0.15)'
          }}>
            <h3 style={{ color: '#3eb489', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Примеры слов</h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {[
                { uga: 'Уга-Буга', translation: 'Спасибо' },
                { uga: 'Уга-Бунга', translation: 'До встречи' },
                { uga: 'Тумба-Юмба', translation: 'Не за что' },
                { uga: 'Умба-Бубумба', translation: 'вот это да!' }
              ].map((word) => (
                <div
                  key={word.uga}
                  style={{
                    background: 'white',
                    border: '1px solid rgba(62, 180, 137, 0.2)',
                    padding: '1rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    minWidth: '110px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#3eb489';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(62, 180, 137, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#3eb489', marginBottom: '0.3rem' }}>
                    {word.uga}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {word.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
