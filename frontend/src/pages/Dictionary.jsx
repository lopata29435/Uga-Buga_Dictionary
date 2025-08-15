import React, { useState, useEffect } from 'react';
import ProfileSection from '../components/ProfileSection';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import config from '../config/api.js';

const Dictionary = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingWord, setEditingWord] = useState(null);
  const [editForm, setEditForm] = useState({ word: '', translation: '', exampleSentence: '' });
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Добавляем задержку для инициализации
    const initTimer = setTimeout(() => {
      setInitializing(false);
    }, 500); // 500ms задержка

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    // Дожидаемся и инициализации, и загрузки AuthContext
    if (!initializing && !authLoading && isAuthenticated) {
      // Дополнительная небольшая задержка перед запросом
      const fetchTimer = setTimeout(() => {
        fetchWords();
      }, 200);

      return () => clearTimeout(fetchTimer);
    } else if (!initializing && !authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, initializing]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}${config.endpoints.dictionary.words}`);
      setWords(response.data);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке словаря: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (word) => {
    setEditingWord(word.id);
    setEditForm({
      word: word.word,
      translation: word.translation,
      exampleSentence: word.exampleSentence || ''
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${config.API_URL}${config.endpoints.dictionary.wordById(id)}`, editForm);
      setEditingWord(null);
      fetchWords(); // Обновляем список
    } catch (err) {
      setError('Ошибка при обновлении слова: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это слово?')) {
      try {
        await axios.delete(`${config.API_URL}${config.endpoints.dictionary.wordById(id)}`);
        fetchWords(); // Обновляем список
      } catch (err) {
        setError('Ошибка при удалении слова: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleCancel = () => {
    setEditingWord(null);
    setEditForm({ word: '', translation: '', exampleSentence: '' });
  };

  // Показываем лоадер во время инициализации
  if (initializing || authLoading) {
    return (
      <div>
        <ProfileSection
          name="Администратор"
          subtitle="Инициализация..."
        />
        <div className="page-container">
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(62, 180, 137, 0.2)',
              borderTop: '4px solid #3eb489',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h2 style={{ color: '#3eb489', fontSize: '1.3rem', fontWeight: '500' }}>
              Загрузка словаря...
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Подготавливаем данные для отображения
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <ProfileSection
          name="Администратор"
          subtitle="Доступ ограничен"
        />
        <div className="page-container">
          <h1 className="page-title">Доступ ограничен</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
            Для просмотра словаря необходимо войти в систему.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileSection
        name="Администратор"
        subtitle="Словарь языка Уга-Бунга"
      />

      <div className="page-container">
        <h1 className="page-title">Словарь Уга-Бунга</h1>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Загрузка словаря...</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', color: '#6c757d' }}>
                Всего слов в словаре: <strong>{words.length}</strong>
              </p>
            </div>

            <div className="words-grid">
              {words.map((word) => (
                <div key={word.id} className="word-card">
                  {editingWord === word.id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Слово:</label>
                        <input
                          type="text"
                          value={editForm.word}
                          onChange={(e) => setEditForm({...editForm, word: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Перевод:</label>
                        <input
                          type="text"
                          value={editForm.translation}
                          onChange={(e) => setEditForm({...editForm, translation: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Пример:</label>
                        <input
                          type="text"
                          value={editForm.exampleSentence}
                          onChange={(e) => setEditForm({...editForm, exampleSentence: e.target.value})}
                        />
                      </div>
                      <div className="edit-buttons">
                        <button
                          onClick={() => handleSave(word.id)}
                          className="btn-save"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-cancel"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="word-header">
                        <h3 className="uga-word">{word.word}</h3>
                        <div className="word-actions">
                          <button
                            onClick={() => handleEdit(word)}
                            className="btn-edit"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(word.id)}
                            className="btn-delete"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="translation">{word.translation}</p>
                      {word.exampleSentence && (
                        <p className="example">{word.exampleSentence}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {words.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h3>Словарь пуст</h3>
                <p>В словаре пока нет ни одного слова.</p>
                <a href="/add-word" className="btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem', width: 'auto' }}>
                  Добавить первое слово
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
