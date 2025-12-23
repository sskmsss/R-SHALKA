// theme_js/Loops_js.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loops_js.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

const LoopsJsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false); // Новое состояние

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const newTask = await generateTask("JavaScript", "loops");
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
    <div className="loops-js-container">
      <button className="back-button" onClick={handleBackClick}>
        ← Назад
      </button>

      <div className="left-panel">
        <h1>БАЗА ПО ВЫБРАННОЙ ТЕМЕ</h1>
        <h2>ЦИКЛЫ (JAVASCRIPT)</h2>

        <div className="theory-content">
          <p>
            <strong>Что такое циклы?</strong><br />
            Циклы позволяют выполнять блок кода <strong>многократно</strong>, пока выполняется условие.
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
              placeholder="Напишите ваш код здесь. Например:&#10;for (let i = 1; i <= 5; i++) console.log(i);"
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

export default LoopsJsPage;