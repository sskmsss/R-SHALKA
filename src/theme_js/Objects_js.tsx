// src/theme_js/Objects_js.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Objects_js.css";

const ObjectsJsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    alert("Генерация задачи по теме 'Объекты (JS)'... Скоро будет настоящая ИИ-генерация!");
  };

  const handleCheckSolution = () => {
    alert("Проверка решения... Пока что это заглушка, но скоро будет ИИ-проверка!");
  };


  const handleBackClick = () => {
    navigate("/js/tema");
  };

  return (
    <div className="lists-container">
      {/* Кнопка НАЗАД — в корне контейнера, как в образце */}
      <button className="back-button" onClick={handleBackClick}>
        ← Назад
      </button>

      <div className="left-panel">
        <h1>БАЗА ПО ВЫБРАННОЙ ТЕМЕ</h1>
        <h2>ОБЪЕКТЫ (JAVASCRIPT)</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое объект в JavaScript?</strong><br />
            Объект — это коллекция пар «ключ: значение», которая используется для хранения и организации данных.
          </p>

          <p>
            <strong>Создание объекта:</strong><br />
            <pre className="code-example">
              <code>{`// Литерал объекта
let user = {
  name: "Анна",
  age: 25,
  city: "Москва"
};

// Через new Object()
let book = new Object();
book.title = "JS Guide";`}</code>
            </pre>
          </p>

          <p>
            <strong>Доступ к свойствам:</strong><br />
            <pre className="code-example">
              <code>{`user.name;        // "Анна"
user["age"];     // 25

// Добавление/изменение
user.email = "anna@example.com";
user.age = 26;`}</code>
            </pre>
          </p>

          <p>
            <strong>Методы объекта:</strong><br />
            <pre className="code-example">
              <code>{`let calculator = {
  add(a, b) {
    return a + b;
  },
  multiply(a, b) {
    return a * b;
  }
};

calculator.add(2, 3); // 5`}</code>
            </pre>
          </p>

          <p>
            <strong>Полезные методы:</strong><br />
            - <code>Object.keys(obj)</code> — массив ключей<br />
            - <code>Object.values(obj)</code> — массив значений<br />
            - <code>Object.entries(obj)</code> — массив пар [ключ, значение]
          </p>

          <p>
            <strong>Совет:</strong><br />
            Объекты в JS — основа всего: функции, массивы, даже классы — всё это объекты!
          </p>
        </div>

        <button className="generate-btn" onClick={handleGenerateClick}>
          ГЕНЕРАЦИЯ ЗАДАЧИ
        </button>
      </div>

      <div className="right-panel">
        <h1>ЗАДАЧА</h1>
        <div className="task-placeholder">
          <p>
            Напишите функцию <code>getUserInfo(user)</code>, которая принимает объект пользователя с полями <code>name</code> и <code>age</code> и возвращает строку вида: <code>"Анна, 25 лет"</code>.
          </p>
          <p>
            Пример:
            <pre className="code-example">
              <code>{`getUserInfo({ name: "Иван", age: 30 }) → "Иван, 30 лет"`}</code>
            </pre>
          </p>
        </div>

        <div className="code-editor">
          <h3>КОД</h3>
          <textarea
            placeholder="Напишите решение здесь..."
            rows={15}
            className="code-input"
          ></textarea>
        </div>
      {/* Оранжевая кнопка "Проверить решение" */}
        <button className="check-btn" onClick={handleCheckSolution}>
          ПРОВЕРИТЬ РЕШЕНИЕ
        </button>
      </div>
    </div>
  );
};

export default ObjectsJsPage;