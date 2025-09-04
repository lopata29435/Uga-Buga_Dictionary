import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/api';
import { useAuth } from '../context/useAuthHook';

const PublicDictionary = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);

      // Публичный запрос без токена авторизации
      const response = await fetch(`${config.API_URL}/dictionary/words`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const data = await response.json();
      setWords(data);
    } catch (err) {
      console.error('Ошибка при загрузке слов:', err);
      setError('Не удалось загрузить словарь. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (wordId) => {
    if (isAuthenticated) {
      // Только авторизованные пользователи могут просматривать детали слов
      navigate(`/dictionary`);
    } else {
      // Неавторизованных пользователей направляем на страницу входа
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Загрузка словаря...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchWords} className="retry-btn">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Публичный словарь Уга-Бунга</h1>
        <p className="page-description">
          Здесь вы можете увидеть все слова в нашем словаре.
          {!isAuthenticated && (
            <span> Для просмотра деталей, добавления и редактирования слов необходимо <a href="/login">войти в систему</a>.</span>
          )}
        </p>
      </div>

      <div className="words-stats">
        <div className="stat-item">
          <span className="stat-number">{words.length}</span>
          <span className="stat-label">слов в словаре</span>
        </div>
      </div>

      {words.length === 0 ? (
        <div className="empty-state">
          <p>Словарь пока пуст.</p>
          {isAuthenticated && (
            <button
              onClick={() => navigate('/add-word')}
              className="primary-btn"
            >
              Добавить первое слово
            </button>
          )}
        </div>
      ) : (
        <div className="words-grid">
          {words.map((word) => (
            <div
              key={word.id}
              className="word-card public"
              onClick={() => handleWordClick(word.id)}
            >
              <div className="word-main">
                <h3 className="word-text">{word.word}</h3>
                <p className="word-translation">{word.translation}</p>
              </div>
              {word.exampleSentence && (
                <div className="word-example">
                  <p>"{word.exampleSentence}"</p>
                </div>
              )}
              <div className="word-actions">
                {isAuthenticated ? (
                  <span className="view-hint">Нажмите для просмотра деталей</span>
                ) : (
                  <span className="login-hint">Войдите для просмотра деталей</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicDictionary;
