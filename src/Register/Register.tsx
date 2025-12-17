import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from '../services/config';

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      alert("Заполните все поля");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен быть не короче 6 символов");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 201) {
        alert("Регистрация прошла успешно!");
        navigate("/login");
      } else {
        const errorData = await response.text();
        console.error('Ошибка регистрации:', response.status, errorData);
        alert("Ошибка регистрации");
      }
    } catch (error) {
      console.error('Ошибка сети при регистрации:', error);
      alert("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">РЕГИСТРАЦИЯ</h2>
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
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Загрузка..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
        </button>
      </form>
      <p className="auth-link">
        Уже есть аккаунт?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="auth-link-button"
        >
          Войти
        </button>
      </p>
    </div>
  );
};

export default Register;