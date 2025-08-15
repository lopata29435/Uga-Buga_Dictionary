import React, { useState } from 'react';
import ProfileSection from '../components/ProfileSection';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config/api.js';

const Search = () => {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await axios.get(`${config.API_URL}${config.endpoints.dictionary.search}`, {
        params: { q: query.trim() }
      });
      setResults(response.data);
    } catch (err) {
      setError('Ошибка при поиске: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <ProfileSection
          name="Администратор"
          subtitle="Поиск доступен только авторизованным пользователям"
        />
        <div className="page-container">
          <h1 className="page-title">Доступ ограничен</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
            Для поиска в словаре необходимо войти в систему.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileSection
        name="Администратор"
        subtitle="Поиск в словаре Уга-Бунга"
      />

      <div className="page-container">
        <h1 className="page-title">Поиск в словаре</h1>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите слово Уга-Бунга или перевод..."
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
              >
                {loading ? 'Ищем...' : 'Найти'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {error}
            </div>
          )}

          {hasSearched && !loading && (
            <div>
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                  {results.length > 0
                    ? `Найдено результатов: ${results.length}`
                    : `По запросу "${query}" ничего не найдено`
                  }
                </p>
              </div>

              {results.length > 0 ? (
                <div className="search-results">
                  {results.map((word) => (
                    <div key={word.id} className="word-card search-result">
                      <div className="word-header">
                        <h3 className="uga-word">{word.word}</h3>
                      </div>
                      <p className="translation">{word.translation}</p>
                      {word.exampleSentence && (
                        <p className="example">{word.exampleSentence}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
                  <h3>Ничего не найдено</h3>
                  <p style={{ marginBottom: '2rem' }}>
                    Попробуйте изменить поисковый запрос или добавьте это слово в словарь
                  </p>
                  <Link
                    to="/add-word"
                    className="btn"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                      width: 'auto',
                      padding: '0.8rem 2rem'
                    }}
                  >
                    Добавить слово "{query}"
                  </Link>
                </div>
              )}
            </div>
          )}

          {!hasSearched && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>Начните поиск</h3>
              <p style={{ color: '#6b7280' }}>
                Введите слово Уга-Бунга или его перевод для поиска в словаре
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
