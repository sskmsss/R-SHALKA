from pydantic import BaseModel


class Theme(BaseModel):
    code: str
    name: str