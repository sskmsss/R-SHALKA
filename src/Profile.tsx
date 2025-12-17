// src/Profile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Вспомогательная функция для декодирования JWT-токена
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Ошибка при декодировании токена:", e);
    return null;
  }
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Убран setError, так как он нигде не определён

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      // Если токена нет — отправляем на логин
      navigate("/login");
      return;
    }

    // Пытаемся извлечь email из токена
    const decodedToken = parseJwt(token);
    
    if (decodedToken && decodedToken.email) {
      setUserEmail(decodedToken.email);
    } else {
      // Если в токене нет email (например, бэкенд не включил его), можно показать generic имя
      // или оставить как есть — пользователь увидит "Нет данных пользователя"
      console.warn("Email не найден в токене. Проверьте, включает ли бэкенд email в JWT-токен.");
      setUserEmail(null); // или можно установить "Пользователь"
    }

    setIsLoading(false);
  }, [navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button className="back-button" onClick={handleBack}>
        ← Назад
      </button>

      <div className="profile-content">
        <h2>ЛИЧНЫЙ КАБИНЕТ</h2>
        
        {/* Убрана строка с setError */}
        
        {userEmail ? (
          <>
            <p>Привет, <strong>{userEmail}</strong>!</p>
            <p>Вы успешно вошли в систему.</p>
          </>
        ) : (
          <p>Нет данных пользователя</p>
        )}
        
        <button className="logout-button" onClick={handleLogout}>
          ВЫЙТИ ИЗ АККАУНТА
        </button>
      </div>
    </div>
  );
};

export default Profile;