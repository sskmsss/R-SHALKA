import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from '../services/config';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Заполните все поля");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Вход успешен, токен:', data.access_token);
        localStorage.setItem('access_token', data.access_token);
        alert("Вход выполнен!");
        navigate("/profile");
      } else {
        const errorData = await response.text();
        console.error('Ошибка входа:', response.status, errorData);
        alert("Неверный логин или пароль");
      }
    } catch (error) {
      console.error('Ошибка сети при входе:', error);
      alert("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">ВХОД</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          minLength={6}
          required
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Загрузка..." : "ВОЙТИ"}
        </button>
      </form>
      <p className="auth-link">
        Нет аккаунта?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="auth-link-button"
        >
          Зарегистрироваться
        </button>
      </p>
    </div>
  );
};

export default Login;