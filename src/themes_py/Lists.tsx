// themes_py/Lists.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Lists.css";
import { generateTask } from "../services/taskService";
import type { Task } from "../services/taskService";

// Объявляем расширения для глобального объекта window
declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<any>;
    pyodide?: any;
  }
}

const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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

  // ✅ ОСНОВНАЯ ФУНКЦИЯ: ПОЛНАЯ ПРОВЕРКА РЕШЕНИЯ
  const handleCheckSolution = async () => {
    if (!task) {
      alert("Сначала сгенерируйте задачу");
      return;
    }

    const codeInput = document.querySelector('.code-input') as HTMLTextAreaElement;
    if (!codeInput || !codeInput.value.trim()) {
      alert("Напишите решение перед проверкой");
      return;
    }

    // Убедимся, что у задачи есть id (fallback на title если нет)
    const taskId = (task as any).id || task.title;

    setIsChecking(true);
    setConsoleOutput("Отправка кода на проверку...");

    try {
      // Формируем JSON-объект с данными
      const submissionData = {
        task_id: taskId,
        language: "python",
        user_code: codeInput.value,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://elodia-autotomic-magdalena.ngrok-free.dev/api/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // ✅ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: проверяем "passed", а не "success"
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
    // Универсальная обёртка для всех тем
    const wrappedCode = `
def safe_print(*args, sep=' ', end='\\n', file=None):
    import sys
    output = sep.join(map(str, args)) + end
    __console__.log(output)

import builtins
builtins.print = safe_print

# Универсальная эмуляция input() для всех задач
_input_values = ["1", "2", "3", "0", "стоп", "выход"]
_input_index = 0

def mock_input(prompt=""):
    global _input_index
    if _input_index < len(_input_values):
        value = _input_values[_input_index]
        _input_index += 1
        __console__.log(f">>> {prompt}{value}")
        return value
    __console__.warn("⚠️ Ввод исчерпан. Используйте значения из примеров задачи.")
    return ""

builtins.input = mock_input

try:
${userCode.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    __console__.error(f"❌ Ошибка: {str(e)}")
    import traceback
    __console__.error(traceback.format_exc())
    `;

    await window.pyodide!.runPythonAsync(wrappedCode);

  } catch (e: any) {
    handleConsoleOutput(`⚡ Ошибка выполнения: ${e.message || e}`, 'error');
  }
};

  return (
    <div className="lists-container">
      {/* Кнопка НАЗАД */}
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

          {/* ✅ Зелёная кнопка "ПРОВЕРИТЬ РЕШЕНИЕ" с состоянием */}
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

export default ListsPage;