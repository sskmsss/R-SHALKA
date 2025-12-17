import React from "react";
import { useNavigate } from "react-router-dom";
import "./Array_js.css";

const ArrayJsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    alert("Генерация задачи по теме 'Массивы (JS)'... Скоро будет настоящая ИИ-генерация!");
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
        <h2>МАССИВЫ (JAVASCRIPT)</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое массив в JavaScript?</strong><br />
            Массив — это упорядоченный список значений, которые могут быть любого типа (числа, строки, объекты и т.д.).
          </p>

          <p>
        <strong>Создание массива:</strong><br />
         <pre className="code-example">
         <code>{`let fruits = ["яблоко", "банан", "апельсин"];
 let numbers = [1, 2, 3, 4];
 let mixed = [1, "текст", true, { name: "JS" }];`}</code>
        </pre>

        </p>

          <p>
            <strong>Доступ к элементам:</strong><br />
            - `fruits[0]` → `"яблоко"`<br />
            - `fruits.length` → длина массива<br />
            - `fruits[fruits.length - 1]` → последний элемент
          </p>

          <p>
            <strong>Полезные методы:</strong><br />
            - `.push()` — добавить в конец<br />
            - `.pop()` — удалить из конца<br />
            - `.shift()` / `.unshift()` — начало массива<br />
            - `.slice()` — копия части<br />
            - `.splice()` — изменить массив<br />
            - `.map()`, `.filter()`, `.forEach()` — перебор
          </p>

          <p>
        <strong>Пример:</strong><br />
        <pre className="code-example">
        <code>{`let nums = [1, 2, 3];
 nums.push(4); // [1, 2, 3, 4]
 let doubled = nums.map(x => x * 2); // [2, 4, 6, 8]`}</code>
         </pre>
        </p>

          <p>
            <strong>Совет:</strong><br />
            В JS массивы — это объекты! Они динамические и гибкие.
          </p>
        </div>

        <button className="generate-btn" onClick={handleGenerateClick}>
          ГЕНЕРАЦИЯ ЗАДАЧИ
        </button>
      </div>

      <div className="right-panel">
        <h1>ЗАДАЧА</h1>
        <div className="task-placeholder">
          <p>Напишите функцию, которая принимает массив чисел и возвращает новый массив с удвоенными значениями.</p>
          <p>Пример: <code>doubleArray([1, 2, 3]) → [2, 4, 6]</code></p>
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

export default ArrayJsPage;