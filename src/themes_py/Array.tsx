// themes_py/Array.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Array.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const ArrayPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const newTask = await generateTask("Python", "array");
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
    navigate("/tema");
  };

  return (
    <div className="array-container">
      {/* Кнопка НАЗАД — в корне, как в Lists.tsx */}
      <button className="back-button" onClick={handleBackClick}>
        ← Назад
      </button>

      <div className="left-panel">
        <h1>БАЗА ПО ВЫБРАННОЙ ТЕМЕ</h1>
        <h2>МАССИВЫ</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое массив?</strong><br />
            Массив — это упорядоченный набор элементов одного типа, доступ к которым осуществляется по индексу.
          </p>

          <p>
            <strong>Зачем нужны массивы?</strong><br />
            Чтобы хранить и обрабатывать несколько значений как одно целое. Например: список имён, баллы учеников, координаты точек.
          </p>

          <p>
            <strong>Пример использования:</strong><br />
            <pre className="code-example">
              <code>{`numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num)`}</code>
            </pre>
          </p>

          <p>
            <strong>Основные операции:</strong><br />
            - Доступ по индексу: <code>arr[0]</code><br />
            - Изменение элемента: <code>arr[0] = 10</code><br />
            - Длина массива: <code>len(arr)</code><br />
            - Добавление элемента: <code>arr.append(6)</code>
          </p>

          <p>
            <strong>Полезные советы:</strong><br />
            - Не забывай про границы индексов (IndexError)<br />
            - Используй циклы для перебора<br />
            - Учи методы: <code>.append()</code>, <code>.pop()</code>, <code>.sort()</code>
          </p>

          <p>
            <strong>Практика:</strong><br />
            Напиши программу, которая находит максимальный элемент в массиве.
          </p>

          <p>
            <strong>Дополнительно:</strong><br />
            Многомерные массивы, списки в Python, работа с индексами, срезы.
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

        {/* Оранжевая кнопка */}
        <button className="check-btn" onClick={handleCheckSolution}>
          ПРОВЕРИТЬ РЕШЕНИЕ
        </button>
      </div>
    </div>
  );
};

export default ArrayPage;