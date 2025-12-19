// src/theme_js/Array_js.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Array_js.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const ArrayJsPage: React.FC = () => {
  const navigate = useNavigate();

  // Состояние для хранения сгенерированной задачи
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  const handleGenerateClick = async () => {
    setIsLoading(true);
    const newTask = await generateTask("JavaScript", "array");
    console.log('Полученная задача:', newTask);
    if (newTask) {
      setTask(newTask);
    } else {
      alert("Не удалось сгенерировать задачу. Попробуйте позже.");
    }
    setIsLoading(false);
  };

  const handleCheckSolution = () => {
    alert("Проверка решения... Пока что это заглушка, но скоро будет ИИ-проверка!");
  };

  const handleBackClick = () => {
    navigate("/js/tema");
  };

  
  const handleRunCode = () => {
    const codeInput = document.getElementById('js-code-input') as HTMLTextAreaElement;
    if (!codeInput || !codeInput.value.trim()) {
      setConsoleOutput('// Введите код для выполнения');
      return;
    }

    const userCode = codeInput.value;
    let output = '';

    try {
      // Безопасное окружение console
      const safeConsole = {
        log: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          output += `<span class="console-log">console.log:</span> ${message}\n`;
        },
        error: (...args: any[]) => {
          const message = args.map(arg => String(arg)).join(' ');
          output += `<span class="console-error">ERROR:</span> ${message}\n`;
        },
        warn: (...args: any[]) => {
          const message = args.map(arg => String(arg)).join(' ');
          output += `<span class="console-warn">WARN:</span> ${message}\n`;
        }
      };

      // Выполняем ТОЛЬКО пользовательский код — БЕЗ ТЕСТОВ!
      const wrappedCode = `
        (function() {
          try {
            ${userCode}
          } catch (e) {
            console.error('Исключение в коде:', e.message);
          }
        })();
      `;

      new Function('console', wrappedCode)(safeConsole);

      // Выводим результат
      setConsoleOutput(output || '// Код выполнен. Нет вывода в консоль.');

    } catch (e: any) {
      setConsoleOutput(`<span class="console-error">⚡ Системная ошибка: ${e.message}</span>`);
    }
  };

  return (
    <div className="array-js-container">
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
              <code>{`// Литерал массива
let fruits = ["яблоко", "банан", "апельсин"];
let numbers = [1, 2, 3, 4];
let mixed = [1, "текст", true, { name: "JS" }];`}</code>
            </pre>
          </p>

          <p>
            <strong>Доступ к элементам и методы:</strong><br />
            <pre className="code-example">
              <code>{`let nums = [1, 2, 3];
console.log(nums[0]); // 1
console.log(nums.length); // 3

// Методы
nums.push(4); // [1,2,3,4]
let doubled = nums.map(x => x * 2); // [2,4,6,8]`}</code>
            </pre>
          </p>

          <p>
            <strong>Полезные методы:</strong><br />
            - <code>.push()</code> — добавить в конец<br />
            - <code>.pop()</code> — удалить из конца<br />
            - <code>.shift()</code> / <code>.unshift()</code> — начало массива<br />
            - <code>.slice()</code> — копия части<br />
            - <code>.splice()</code> — изменить массив<br />
            - <code>.map()</code>, <code>.filter()</code>, <code>.forEach()</code> — перебор
          </p>

          <p>
            <strong>Совет:</strong><br />
            В JS массивы — это объекты! Они динамические и гибкие.
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
            id="js-code-input"
            placeholder="Напишите ваш код здесь. Например:&#10;console.log([1,2,3].map(x => x * 2));"
            rows={12}
            className="code-input"
          ></textarea>
        </div>

        {/* Оранжевая кнопка "ВЫПОЛНИТЬ КОД" — слева, под редактором */}
        <button
          className="run-code-btn"
          onClick={handleRunCode}
        >
          ВЫПОЛНИТЬ КОД
        </button>

        {/* Консоль */}
        <div className="console-output">
          <h3>КОНСОЛЬ</h3>
          <pre className="console-text" dangerouslySetInnerHTML={{ __html: consoleOutput }}></pre>
        </div>

        {/* Зелёная кнопка "ПРОВЕРИТЬ РЕШЕНИЕ" — в правом нижнем углу */}
        <button className="check-btn" onClick={handleCheckSolution}>
          ПРОВЕРИТЬ РЕШЕНИЕ
        </button>
      </div>
    </div>
  );
};

export default ArrayJsPage;