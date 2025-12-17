import React from "react";
import { useNavigate } from "react-router-dom";
import "./Loops_js.css";

const LoopsJsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    alert("Генерация задачи по теме 'Циклы (JS)'... Скоро будет настоящая ИИ-генерация!");
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
        <h2>ЦИКЛЫ (JAVASCRIPT)</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое циклы?</strong><br />
            Циклы позволяют выполнять блок кода **многократно**, пока выполняется условие.
          </p>

          <p>
            <strong>Основные циклы в JavaScript:</strong><br />
            - <code>for</code> — счётный цикл<br />
            - <code>while</code> — пока условие истинно<br />
            - <code>do...while</code> — выполнить хотя бы раз<br />
            - <code>for...of</code> — перебор значений (массивы, строки)<br />
            - <code>for...in</code> — перебор ключей (объекты)
          </p>

          <p>
            <strong>Примеры:</strong><br />
            <pre className="code-example">
              <code>{`// for
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}

// while
let count = 0;
while (count < 3) {
  console.log("Привет");
  count++;
}

// for...of
let fruits = ["яблоко", "банан"];
for (let fruit of fruits) {
  console.log(fruit);
}`}</code>
            </pre>
          </p>

          <p>
            <strong>Управляющие инструкции:</strong><br />
            - <code>break</code> — выйти из цикла<br />
            - <code>continue</code> — пропустить текущую итерацию
          </p>

          <p>
            <strong>Совет:</strong><br />
            - Используй <code>for...of</code> для массивов и строк<br />
            - Избегай <code>for...in</code> для массивов (он перебирает индексы как строки!)
          </p>

          <p>
            <strong>Практика:</strong><br />
            Напиши цикл, который выводит все чётные числа от 1 до 10.
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
            Напишите функцию <code>printNumbers(n)</code>, которая выводит в консоль все числа от 1 до <code>n</code>, но вместо чисел, кратных 3, выводит слово <code>"Fizz"</code>.
          </p>
          <p>
            Пример:
            <pre className="code-example">
              <code>{`printNumbers(5);
// Вывод:
// 1
// 2
// Fizz
// 4
// 5`}</code>
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

export default LoopsJsPage;