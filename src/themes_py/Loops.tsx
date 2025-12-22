// themes_py/Loops.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Loops.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

// Объявляем расширения для глобального объекта window
declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<any>;
    pyodide?: any;
  }
}

const LoopsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  // Загрузка Pyodide при первом рендере
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide!({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" // УБРАНЫ ПРОБЕЛЫ
        });

        // Создаем глобальный объект __console__ и передаем его в Pyodide
        const consoleObj = {
          log: (msg: string) => handleConsoleOutput(msg, 'log'),
          error: (msg: string) => handleConsoleOutput(msg, 'error'),
          warn: (msg: string) => handleConsoleOutput(msg, 'warn')
        };

        // Устанавливаем __console__ в глобальное пространство Pyodide
        pyodideInstance.globals.set("__console__", consoleObj);

        // Устанавливаем stdout/stderr
        pyodideInstance.setStdout({
          write: (str: string) => handleConsoleOutput(str, 'log'),
          flush: () => {}
        });
        pyodideInstance.setStderr({
          write: (str: string) => handleConsoleOutput(str, 'error'),
          flush: () => {}
        });

        window.pyodide = pyodideInstance;
        setIsPyodideReady(true);
        setConsoleOutput('// Python среда успешно загружена ✅');
      } catch (error) {
        console.error('Ошибка загрузки Pyodide:', error);
        setConsoleOutput('❌ Ошибка загрузки Python среды. Попробуйте обновить страницу.');
      }
    };

    // Проверяем, загружен ли Pyodide
    if (window.pyodide) {
      setIsPyodideReady(true);
      setConsoleOutput('// Python среда уже загружена');
      return;
    }

    // Если loadPyodide существует как функция — загружаем напрямую
    if (window.loadPyodide) {
      loadPyodide();
      return;
    }

    // Если нет — загружаем скрипт Pyodide.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; // УБРАНЫ ПРОБЕЛЫ
    script.async = true;
    script.onload = () => {
      if (window.loadPyodide && typeof window.loadPyodide === 'function') {
        loadPyodide();
      } else {
        setConsoleOutput('❌ Не удалось загрузить Pyodide. Попробуйте обновить страницу.');
      }
    };
    script.onerror = () => {
      setConsoleOutput('❌ Ошибка загрузки Pyodide. Проверьте интернет-соединение.');
    };
    document.head.appendChild(script);

    // Cleanup function для удаления скрипта
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleConsoleOutput = (message: string, type: 'log' | 'error' | 'warn' = 'log') => {
    // Отфильтровываем пустые строки и системный мусор
    if (!message.trim()) return;

    // Пропускаем служебные сообщения Pyodide
    if (message.includes('[PYODIDE]') || message.includes('Loading') || message.includes('Loaded')) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `<span class="timestamp">[${timestamp}]</span> <span class="${type}">${type.toUpperCase()}:</span>`;
    setConsoleOutput(prev => {
      // Ограничиваем размер консоли для предотвращения переполнения памяти
      const lines = (prev + `${prefix} ${message}\n`).split('\n');
      return lines.slice(-100).join('\n'); // Сохраняем только последние 100 строк
    });
  };

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

  const handleRunCode = async () => {
    if (!isPyodideReady) {
      setConsoleOutput('⏳ Загрузка Python среды. Пожалуйста, подождите...');
      return;
    }

    const codeInput = document.querySelector('.code-input') as HTMLTextAreaElement;
    if (!codeInput || !codeInput.value.trim()) {
      setConsoleOutput('// Введите код для выполнения');
      return;
    }

    const userCode = codeInput.value;
    setConsoleOutput(prev => prev + '\n>>> Выполнение кода...\n');

    try {
      // Оборачиваем код с безопасным print
      const wrappedCode = `
def safe_print(*args, sep=' ', end='\\n', file=None):
    """Безопасная замена print для Pyodide"""
    import sys
    output = sep.join(map(str, args)) + end
    # Отправляем в нашу консоль
    __console__.log(output)

# Переопределяем print
import builtins
builtins.print = safe_print

try:
${userCode.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    __console__.error(f"❌ Исключение: {str(e)}")
    import traceback
    __console__.error(traceback.format_exc())
      `;

      // Выполняем код
      await window.pyodide!.runPythonAsync(wrappedCode);

    } catch (e: any) {
      handleConsoleOutput(`⚡ Системная ошибка: ${e.message || e}`, 'error');
    }
  };

  return (
    <div className="loops-container">
      {/* Кнопка НАЗАД */}
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

      {/* Правая панель с прокруткой */}
      <div className="right-panel">
        <div className="right-panel-content">
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
              rows={12}
              className="code-input"
            ></textarea>
          </div>

          {/* Оранжевая кнопка "ВЫПОЛНИТЬ КОД" */}
          <button
            className="run-code-btn"
            onClick={handleRunCode}
            disabled={!isPyodideReady}
          >
            {isPyodideReady ? "ВЫПОЛНИТЬ КОД" : "ЗАГРУЗКА PYTHON..."}
          </button>

          {/* Консоль выполнения */}
          <div className="console-output">
            <h3>КОНСОЛЬ PYTHON</h3>
            <pre className="console-text" dangerouslySetInnerHTML={{ __html: consoleOutput }}></pre>
          </div>

          {/* Зелёная кнопка "ПРОВЕРИТЬ РЕШЕНИЕ" */}
          <button className="check-btn" onClick={handleCheckSolution}>
            ПРОВЕРИТЬ РЕШЕНИЕ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoopsPage;