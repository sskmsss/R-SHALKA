import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tema.css";


const Tema: React.FC = () => {
  const navigate = useNavigate();

  const topics = ["Массивы", "Списки", "Циклы"];

  const handleTopicClick = (topic: string) => {
    switch (topic) {
      case "Массивы":
        navigate("/array");
        break;
      case "Списки":
      navigate("/lists");
      break;;
      case "Циклы":
      navigate("/loops");
      break;
      default:
        alert("Эта тема ещё не реализована");
    }
  };

  return (
    <div className="tema-container">
      {/* Кнопка назад */}
      <button className="back-button" onClick={() => navigate("/")}>
        ← Назад
      </button>

      {/* Основной контент */}
      <div className="tema-content">
        <h1 className="title">ТЕМЫ</h1>
        <ul className="topics-list">
          {topics.map((topic, index) => (
            <li key={index} className="topic-item" onClick={() => handleTopicClick(topic)}>
              – {topic}
            </li>
          ))}
        </ul>
      </div>

      {/* Логотип Python */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
        alt="Python"
        className="python-logo"
      />
    </div>
  );
};

export default Tema;