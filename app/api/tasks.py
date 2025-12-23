# app/api/tasks.py
from fastapi import APIRouter, HTTPException
from app.schemas.tasks import GenerateTaskRequest, GenerateTaskResponse, SubmitSolutionRequest, SubmitSolutionResponse
from app.services.ai_service import generate_task_with_groq, check_solution_with_groq
import logging
import json
import uuid # <-- Для генерации уникального ID задачи

logger = logging.getLogger(__name__)

# --- ВРЕМЕННОЕ ХРАНИЛИЩЕ ЗАДАЧ ---
# Это словарь, который будет очищен при перезапуске сервера!
# Ключ - уникальный ID задачи, значение - словарь с данными задачи
temp_tasks_storage = {}
# ------------------------------

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/generate", response_model=GenerateTaskResponse)
async def generate_task(request: GenerateTaskRequest):
    """
    Генерирует новую задачу по программированию с помощью Groq API и сохраняет её во временной памяти.
    Возвращает задачу с уникальным ID.
    """
    logger.info(f"Запрос на генерацию задачи: язык={request.language}, тема={request.topic}")

    task_data = await generate_task_with_groq(request.language, request.topic)

    if not task_data:
        logger.error("Не удалось сгенерировать задачу")
        raise HTTPException(status_code=500, detail="Не удалось сгенерировать задачу")

    # --- Преобразование example_input и example_output в строки ---
    if 'example_input' in task_data and not isinstance(task_data['example_input'], str):
        task_data['example_input'] = json.dumps(task_data['example_input'], ensure_ascii=False)
    if 'example_output' in task_data and not isinstance(task_data['example_output'], str):
        task_data['example_output'] = json.dumps(task_data['example_output'], ensure_ascii=False)
    # ------------------------------------------------------------------------

    # Генерируем уникальный ID для задачи
    task_id = str(uuid.uuid4())

    # Сохраняем задачу во временной памяти с этим ID
    temp_tasks_storage[task_id] = task_data

    # Подготовим данные для Pydantic-модели, добавив ID
    task_data_with_id = task_data.copy()
    task_data_with_id['id'] = task_id

    try:
        # Создаём объект Pydantic-модели из данных
        response_model = GenerateTaskResponse(**task_data_with_id)
        logger.info(f"Задача успешно сгенерирована и сохранена во временной памяти: {response_model.title}, ID: {response_model.id}")
        return response_model
    except Exception as e:
        logger.error(f"Ошибка валидации ответа от Groq (генерация): {e}")
        logger.error(f"Ответ Groq: {task_data_with_id}")
        raise HTTPException(status_code=500, detail="Ошибка валидации сгенерированной задачи")


# --- Обновлённый эндпоинт для проверки решения ---
@router.post("/submit", response_model=SubmitSolutionResponse)
async def submit_solution(request: SubmitSolutionRequest):
    """
    Отправляет решение пользователя на проверку с помощью Groq API.
    Загружает задачу по task_id из временной памяти.
    """
    logger.info(f"Проверка решения пользователя для задачи ID: {request.task_id}")

    # Проверим, есть ли задача с таким ID во временной памяти
    task_data = temp_tasks_storage.get(request.task_id)
    if not task_data:
        logger.error(f"Задача с ID {request.task_id} не найдена во временной памяти. Возможно, срок жизни задачи истёк или ID неверен.")
        raise HTTPException(status_code=404, detail="Задача не найдена. Пожалуйста, сгенерируйте задачу заново.")

    # Передаём данные задачи из памяти в функцию проверки
    check_result = await check_solution_with_groq(
        user_code=request.user_code,
        task_description=task_data.get("description", ""),
        example_input=task_data.get("example_input", ""),
        example_output=task_data.get("example_output", "")
    )

    if not check_result:
        logger.error("Не удалось проверить решение")
        raise HTTPException(status_code=500, detail="Не удалось проверить решение")

    # Проверим, что результат содержит нужные поля
    if 'result' not in check_result or 'explanation' not in check_result:
        logger.error(f"Ответ от Groq (проверка) не содержит ожидаемых полей: {check_result}")
        raise HTTPException(status_code=500, detail="Неверный формат ответа от ИИ при проверке")

    try:
        # Создаём объект Pydantic-модели из данных
        response_model = SubmitSolutionResponse(**check_result)
        logger.info(f"Решение проверено: {response_model.result}")
        return response_model
    except Exception as e:
        logger.error(f"Ошибка валидации ответа от Groq (проверка): {e}")
        logger.error(f"Ответ Groq (проверка): {check_result}")
        raise HTTPException(status_code=500, detail="Ошибка валидации результата проверки")