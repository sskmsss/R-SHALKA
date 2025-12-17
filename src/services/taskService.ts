// src/services/taskService.ts
import { API_BASE_URL } from './config';

export interface Task {
  title: string;
  description: string;
  example_input?: string;
  example_output?: string;
  hint?: string;
}

export const generateTask = async (language: string, topic: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language, topic }),
    });

    if (response.status === 200) {
      const task: Task = await response.json();
      return task;
    } else {
      console.error('Ошибка генерации задачи:', response.status, await response.text());
      return null;
    }
  } catch (error) {
    console.error('Сетевая ошибка при генерации задачи:', error);
    return null;
  }
};