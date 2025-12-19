from pydantic import BaseModel
from typing import Optional, Union
from typing_extensions import Any

class GenerateTaskRequest(BaseModel):
    language: str
    topic: str


class GenerateTaskResponse(BaseModel):
    title: str
    description: str
    example_input: Optional[Union[str, list, dict, int, float]] = ""
    example_output: Optional[Union[str, list, dict, int, float]] = ""
    hint: Optional[str] = ""

    class Config:
        from_attributes = True