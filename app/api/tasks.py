# app/api/tasks.py
from fastapi import APIRouter, HTTPException
from app.schemas.tasks import GenerateTaskRequest, GenerateTaskResponse
from app.services.ai_service import generate_task_with_groq
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/generate", response_model=GenerateTaskResponse)
async def generate_task(request: GenerateTaskRequest):
    """
    Генерирует новую задачу по программированию с помощью Groq API.
    """
    logger.info(f"Запрос на генерацию задачи: язык={request.language}, тема={request.topic}")

    task_data = await generate_task_with_groq(request.language, request.topic)

    if not task_data:
        logger.error("Не удалось сгенерировать задачу")
        raise HTTPException(status_code=500, detail="Не удалось сгенерировать задачу")

    if 'example_input' in task_data and not isinstance(task_data['example_input'], str):
        task_data['example_input'] = json.dumps(task_data['example_input'], ensure_ascii=False)
    if 'example_output' in task_data and not isinstance(task_data['example_output'], str):
        task_data['example_output'] = json.dumps(task_data['example_output'], ensure_ascii=False)

    try:
        response_model = GenerateTaskResponse(**task_data)
        logger.info(f"Задача успешно сгенерирована: {response_model.title}")
        return response_model
    except Exception as e:
        logger.error(f"Ошибка валидации ответа от Groq: {e}")
        logger.error(f"Ответ Groq: {task_data}")
        raise HTTPException(status_code=500, detail="Ошибка валидации сгенерированной задачи")