// theme_js/Objects_js.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Objects_js.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const ObjectsJsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const newTask = await generateTask("JavaScript", "objects");
      console.log("Полученная задача:", newTask);
      if (newTask) {
        setTask(newTask);
      } else {
        alert("Не удалось сгенерировать задачу. Попробуйте позже.");
      }
    } catch (error) {
      console.error("Ошибка при генерации задачи:", error);
      alert("Произошла ошибка. Проверьте консоль (F12).");
    }
    setIsLoading(false);
  };

  const handleCheckSolution = () => {
    alert("Проверка решения... Пока что это заглушка, но скоро будет ИИ-проверка!");
  };

  const handleBackClick = () => {
    navigate("/js/tema");
  };

  return (
    <div className="objects-js-container">
      {/* Кнопка НАЗАД — в корне */}
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

        <button
          className="generate-btn"
          onClick={handleGenerateClick}
          disabled={isLoading}
        >
          {isLoading ? "Генерация..." : "ГЕНЕРАЦИЯ ЗАДАЧИ"}
        </button>
      </div>

      <div className="right-panel">
        <h1>ЗАДАЧА</h1>

        {task ? (
          <div className="task-placeholder">
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            {task.example_input && task.example_output && (
              <div className="task-examples">
                <h4>Примеры:</h4>
                <div className="example">
                  <strong>Ввод:</strong> <code>{task.example_input}</code>
                </div>
                <div className="example">
                  <strong>Вывод:</strong> <code>{task.example_output}</code>
                </div>
              </div>
            )}

            {task.hint && (
              <div className="task-hint">
                <h4>Подсказка:</h4>
                <p>{task.hint}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="task-placeholder">
            <p>Нажмите «Генерация задачи», чтобы получить новую задачу.</p>
          </div>
        )}

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