// themes_py/Loops.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loops.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const LoopsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const newTask = await generateTask("Python", "loops");
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
    <div className="loops-container">
      {/* Кнопка НАЗАД — в корне, как во всех страницах */}
      <button className="back-button" onClick={handleBackClick}>
        ← Назад
      </button>

      <div className="left-panel">
        <h1>БАЗА ПО ВЫБРАННОЙ ТЕМЕ</h1>
        <h2>ЦИКЛЫ</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое циклы?</strong><br />
            Циклы позволяют выполнять блок кода <strong>многократно</strong>, пока выполняется условие или пока есть элементы для перебора.
          </p>

          <p>
            <strong>Типы циклов в Python:</strong><br />
            - <code>for</code> — для перебора последовательностей (списков, строк, диапазонов)<br />
            - <code>while</code> — пока условие истинно
          </p>

          <p>
            <strong>Примеры:</strong><br />
            <pre className="code-example">
              <code>{`# Цикл for
for i in range(5):
    print(i)

# Цикл while
count = 0
while count < 3:
    print("Привет")
    count += 1`}</code>
            </pre>
          </p>

          <p>
            <strong>Управляющие конструкции:</strong><br />
            - <code>break</code> — немедленно выйти из цикла<br />
            - <code>continue</code> — пропустить текущую итерацию<br />
            - <code>else</code> — блок после цикла (выполняется, если не было break)
          </p>

          <p>
            <strong>Полезные советы:</strong><br />
            - Избегай бесконечных циклов (<code>while True</code> без break)<br />
            - Используй <code>for</code> для перебора коллекций<br />
            - Обновляй счётчик в <code>while</code>, иначе цикл не завершится!
          </p>

          <p>
            <strong>Практика:</strong><br />
            Напиши программу, которая выводит все чётные числа от 1 до 20.
          </p>

          <p>
            <strong>Дополнительно:</strong><br />
            Вложенные циклы, итераторы, функция <code>range()</code>, циклы с условием.
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

export default LoopsPage;