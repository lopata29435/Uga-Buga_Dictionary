import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dictionary from './pages/Dictionary';
import AddWord from './pages/AddWord';
import Search from './pages/Search';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  // Вариант B: жёстко задаём basename
  const basePath = '/uga-buga_dictionary';
  console.log('Router basename =', basePath);
  return (
    <AuthProvider>
      <Router basename={basePath}>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/add-word" element={<AddWord />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            {/* Fallback: перенаправление на корень */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
