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
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false); // Новое состояние

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

  // ✅ РАБОЧАЯ ПРОВЕРКА РЕШЕНИЯ (как в Array_js.tsx)
  const handleCheckSolution = async () => {
    if (!task) {
      alert("Сначала сгенерируйте задачу");
      return;
    }

    const codeInput = document.getElementById('js-code-input') as HTMLTextAreaElement;
    if (!codeInput || !codeInput.value.trim()) {
      alert("Напишите решение перед проверкой");
      return;
    }

    const taskId = (task as any).id || task.title;
    setIsChecking(true);
    setConsoleOutput("Отправка кода на проверку...");

    try {
      const submissionData = {
        task_id: taskId,
        language: "javascript",
        user_code: codeInput.value,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://elodia-autotomic-magdalena.ngrok-free.dev/api/tasks/submit  ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const result = await response.json();
        let output = "";
        if (result.result === "passed") {
          output = `✅ Решение верное!\n${result.explanation}\n\nВывод: ${result.execution_output}`;
        } else {
          output = `❌ Решение содержит ошибки:\n${result.explanation}\n\nВывод: ${result.execution_output}`;
        }
        setConsoleOutput(output);
      } else {
        const errorData = await response.json();
        setConsoleOutput(`⚠️ Ошибка проверки: ${errorData.detail || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка сети при проверке:', error);
      setConsoleOutput(`⚠️ Сетевая ошибка: Проверьте подключение к серверу`);
    } finally {
      setIsChecking(false);
    }
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
      setConsoleOutput(output || '// Код выполнен. Нет вывода в консоль.');

    } catch (e: any) {
      setConsoleOutput(`<span class="console-error">⚡ Системная ошибка: ${e.message}</span>`);
    }
  };

  return (
    <div className="objects-js-container">
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
        <div className="right-panel-content"> {/* Добавлена обёртка для прокрутки */}
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
              placeholder="Напишите ваш код здесь. Например:&#10;console.log({ name: 'Иван', age: 30 });"
              rows={12}
              className="code-input"
            ></textarea>
          </div>

          <button className="run-code-btn" onClick={handleRunCode}>
            ВЫПОЛНИТЬ КОД
          </button>

          <div className="console-output">
            <h3>КОНСОЛЬ</h3>
            <pre className="console-text" dangerouslySetInnerHTML={{ __html: consoleOutput }}></pre>
          </div>

          <button 
            className="check-btn" 
            onClick={handleCheckSolution}
            disabled={isChecking || !task}
          >
            {isChecking ? "ПРОВЕРКА..." : "ПРОВЕРИТЬ РЕШЕНИЕ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjectsJsPage;