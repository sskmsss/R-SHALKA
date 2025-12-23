import logging
from openai import AsyncOpenAI
import json
import re
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
Ты — генератор задач по программированию. Твоя цель — создать уникальную, но понятную задачу
для начинающего программиста на указанном языке программирования и по заданной теме.
Задача должна быть логически связанна с темой, но не обязательно повторять стандартные примеры.
Описание задачи должно быть подробным и содержать:
- Условие задачи (что нужно сделать)
- Примеры входных и выходных данных (если применимо)
- Ограничения (если есть)
После генерации задачи, предоставь её в формате JSON с полями:
- "title": краткое название задачи
- "description": полное описание задачи, включая условие, примеры и ограничения
- "example_input": пример входных данных (опционально)
- "example_output": пример выходных данных (опционально)
- "hint": подсказка для решения (опционально)

Тема: {topic}
Язык: {language}
"""

SYSTEM_PROMPT_CHECK = """
Ты — помощник по программированию. Твоя задача — проанализировать код пользователя
и проверить, правильно ли он решает поставленную задачу.
Ты НЕ должен запускать код, ты должен анализировать его логику и сравнить с описанием задачи.
Ты должен вернуть результат в формате JSON с полями:
- "result": "passed", "failed", "partially_passed", "wrong_answer", "code_error", "logic_error"
- "explanation": объяснение, почему так (на русском языке)

Описание задачи:
{task_description}

Пример ввода (если есть):
{example_input}

Пример вывода (если есть):
{example_output}

Код пользователя:
{user_code}
"""

client = AsyncOpenAI(
    api_key="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",
    base_url="https://api.groq.com/openai/v1"
)

async def generate_task_with_groq(language: str, topic: str) -> dict | None:
    prompt_text = SYSTEM_PROMPT.format(topic=topic, language=language)

    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt_text},
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens=500,
            temperature=0.7,
            top_p=0.9,
            response_format={"type": "json_object"}
        )

        generated_text = response.choices[0].message.content
        if not generated_text:
            logger.error("Ответ от Groq пустой.")
            return None

        match = re.search(r'(?:^|\n)```\s*json\s*(?:^|\n)(.+?)(?:^|\n)```(?:^|\n)?', generated_text, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
        else:
            json_str = generated_text.strip()

        try:
            task_data = json.loads(json_str)
            logger.info(f"Сгенерированная задача: {task_data}")
            return task_data
        except json.JSONDecodeError as e:
            logger.error(f"Ошибка парсинга JSON из ответа Groq: {e}")
            logger.error(f"Ответ Groq (обработанный): {json_str}")
            return None

    except Exception as e:
        logger.error(f"Ошибка при запросе к Groq: {e}")
        return None


async def check_solution_with_groq(user_code: str, task_description: str, example_input: str = "", example_output: str = "") -> dict | None:
    prompt_text = SYSTEM_PROMPT_CHECK.format(
        task_description=task_description,
        example_input=example_input,
        example_output=example_output,
        user_code=user_code
    )

    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt_text},
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens=300,
            temperature=0.9,
            response_format={"type": "json_object"}
        )

        generated_text = response.choices[0].message.content
        if not generated_text:
            logger.error("Ответ от Groq (проверка) пустой.")
            return None

        match = re.search(r'(?:^|\n)```\s*json\s*(?:^|\n)(.+?)(?:^|\n)```(?:^|\n)?', generated_text, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
        else:
            json_str = generated_text.strip()

        try:
            check_result = json.loads(json_str)
            logger.info(f"Результат проверки: {check_result}")
            return check_result
        except json.JSONDecodeError as e:
            logger.error(f"Ошибка парсинга JSON из ответа Groq (проверка): {e}")
            logger.error(f"Ответ Groq (проверка, обработанный): {json_str}")
            return None

    except Exception as e:
        logger.error(f"Ошибка при запросе к Groq (проверка): {e}")
        return None