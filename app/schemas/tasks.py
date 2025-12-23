from pydantic import BaseModel, EmailStr
from typing import Optional, Union
from datetime import datetime

class GenerateTaskRequest(BaseModel):
    language: str
    topic: str

# Ответ от эндпоинта генерации теперь включает ID (временно строку)
class GenerateTaskResponse(BaseModel):
    id: str # <-- Уникальный ID задачи, сгенерированный бэкендом
    title: str
    description: str
    example_input: Optional[Union[str, list, dict, int, float]] = ""
    example_output: Optional[Union[str, list, dict, int, float]] = ""
    hint: Optional[str] = ""

    class Config:
        from_attributes = True

# --- Схема для отправки решения ---
class SubmitSolutionRequest(BaseModel):
    task_id: str # <-- ID задачи, полученный при генерации
    user_code: str

class SubmitSolutionResponse(BaseModel):
    result: str
    explanation: str
    execution_output: Optional[str] = None
    


class SolutionBase(BaseModel):
    user_code: str
    result: str
    explanation: str
    execution_output: Optional[str] = None

class SolutionCreate(SolutionBase):
    task_id: int 

class Solution(SolutionBase):
    id: int
    task_id: int
    submitted_at: datetime

    class Config:
        from_attributes = True