// themes_py/Lists.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Lists.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const newTask = await generateTask("Python", "lists");
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
    <div className="lists-container">
      {/* Кнопка НАЗАД — в корне, как в образце */}
      <button className="back-button" onClick={handleBackClick}>
        ← Назад
      </button>

      <div className="left-panel">
        <h1>БАЗА ПО ВЫБРАННОЙ ТЕМЕ</h1>
        <h2>СПИСКИ</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое список?</strong><br />
            Список в Python — это упорядоченная изменяемая коллекция объектов любого типа.
          </p>

          <p>
            <strong>Чем отличается от массива?</strong><br />
            В Python «массивов» как в других языках нет — вместо них используются списки, которые могут хранить разнотипные элементы.
          </p>

          <p>
            <strong>Пример создания:</strong><br />
            <pre className="code-example">
              <code>{`fruits = ["яблоко", "банан", "апельсин"]
numbers = [1, 2, 3, 4]
mixed = [1, "текст", True]`}</code>
            </pre>
          </p>

          <p>
            <strong>Основные операции:</strong><br />
            - Доступ по индексу: <code>fruits[0]</code> → <code>"яблоко"</code><br />
            - Изменение: <code>fruits[1] = "груша"</code><br />
            - Добавление: <code>fruits.append("манго")</code><br />
            - Удаление: <code>fruits.pop()</code> или <code>del fruits[0]</code><br />
            - Длина: <code>len(fruits)</code>
          </p>

          <p>
            <strong>Полезные методы:</strong><br />
            - <code>.append(x)</code> — добавить в конец<br />
            - <code>.extend(iterable)</code> — добавить несколько элементов<br />
            - <code>.insert(i, x)</code> — вставить по индексу<br />
            - <code>.remove(x)</code> — удалить первое вхождение<br />
            - <code>.sort()</code> — сортировать<br />
            - <code>.reverse()</code> — развернуть
          </p>

          <p>
            <strong>Практика:</strong><br />
            Напиши функцию, которая удаляет все чётные числа из списка.
          </p>

          <p>
            <strong>Совет:</strong><br />
            Списки — основной инструмент в Python. Изучи их вдоль и поперёк!
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

export default ListsPage;