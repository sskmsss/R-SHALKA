from fastapi import APIRouter, Query
from app.schemas.theme import Theme

router = APIRouter(tags=["Themes"])


@router.get("/themes", response_model=list[Theme])
def get_themes(language: str = Query(...)):
    if language == "python":
        return [
            {"code": "basics", "name": "Основы"},
            {"code": "loops", "name": "Циклы"},
            {"code": "lists", "name": "Списки"},
        ]
    return []