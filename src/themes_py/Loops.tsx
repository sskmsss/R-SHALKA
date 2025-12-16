import React from "react";
import { useNavigate } from "react-router-dom";
import "./Loops.css";

const LoopsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    alert("Генерация задачи по теме 'Циклы'... Скоро будет настоящая ИИ-генерация!");
  };

  const handleBackClick = () => {
    navigate("/tema");
  };

  return (
    <div className="loops-container">
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
              <code>
                {`# Цикл for
for i in range(5):
    print(i)

# Цикл while
count = 0
while count < 3:
    print("Привет")
    count += 1`}
              </code>
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

        <button className="generate-btn" onClick={handleGenerateClick}>
          ГЕНЕРАЦИЯ ЗАДАЧИ
        </button>
      </div>

      <div className="right-panel">
        <h1>ЗАДАЧА</h1>
        <div className="task-placeholder">
          <p>
            Напишите функцию, которая принимает число <code>n</code> и выводит все числа от 1 до <code>n</code>, заменяя числа, кратные 3, на слово «Fizz».
          </p>
          <p>
            Пример: <code>fizz(5) → 1, 2, Fizz, 4, 5</code>
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
      </div>
    </div>
  );
};

export default LoopsPage;