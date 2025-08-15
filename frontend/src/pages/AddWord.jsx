import React, { useState } from 'react';
import ProfileSection from '../components/ProfileSection';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config/api.js';

const AddWord = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    exampleSentence: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      await axios.post(`${config.API_URL}${config.endpoints.dictionary.words}`, formData);
      setSuccess('Слово успешно добавлено в словарь!');
      setFormData({ word: '', translation: '', exampleSentence: '' });

      // Через 2 секунды перенаправляем в словарь
      setTimeout(() => {
        navigate('/dictionary');
      }, 2000);
    } catch (err) {
      setError('Ошибка при добавлении слова: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <ProfileSection
          name="Администратор"
          subtitle="Добавление слов доступно только авторизованным пользователям"
        />
        <div className="page-container">
          <h1 className="page-title">Доступ ограничен</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
            Для добавления слов необходимо войти в систему.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileSection
        name="Администратор"
        subtitle="Добавление нового слова в словарь"
      />

      <div className="page-container">
        <h1 className="page-title">Добавить слово</h1>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(62, 180, 137, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid rgba(62, 180, 137, 0.2)'
          }}>
            <h3 style={{ color: '#3eb489', marginBottom: '1rem' }}>Правила добавления слов:</h3>
            <ul style={{ color: '#6b7280', lineHeight: '1.6' }}>
              <li>Слова должны быть на языке Уга-Бунга</li>
              <li>Переводы должны быть точными и понятными</li>
              <li>Примеры помогают понять контекст использования</li>
              <li>Избегайте дублирования существующих слов</li>
            </ul>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(62, 180, 137, 0.1)',
              color: '#1f7a5b',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid rgba(62, 180, 137, 0.3)'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-word-form">
            <div className="form-group">
              <label htmlFor="word">Слово на языке Уга-Бунга *</label>
              <input
                type="text"
                id="word"
                name="word"
                value={formData.word}
                onChange={handleChange}
                required
                placeholder="Например: угату, бунгало, огого..."
                style={{ fontSize: '1.1rem' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="translation">Перевод на русский *</label>
              <input
                type="text"
                id="translation"
                name="translation"
                value={formData.translation}
                onChange={handleChange}
                required
                placeholder="Точный перевод слова"
                style={{ fontSize: '1.1rem' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleSentence">Пример использования</label>
              <textarea
                id="exampleSentence"
                name="exampleSentence"
                value={formData.exampleSentence}
                onChange={handleChange}
                placeholder="Пример предложения с использованием этого слова..."
                rows="3"
                style={{
                  fontSize: '1rem',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
              <small style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Необязательно, но поможет другим понять контекст
              </small>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Добавляем...' : 'Добавить в словарь'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWord;
