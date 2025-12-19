from fastapi import APIRouter
from app.schemas.language import Language

router = APIRouter(tags=["Languages"])


@router.get("/languages", response_model=list[Language])
def get_languages():
    return [
        {"code": "python", "name": "Python"},
    ]