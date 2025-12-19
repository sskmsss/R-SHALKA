from datetime import datetime, timedelta
from typing import Union
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.schemas.user import TokenData
from app.models.user import User
from app.core.security import verify_password
from sqlalchemy.orm import Session
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # Добавляем email в payload, помимо sub
    to_encode["email"] = data["sub"]  # Или data.get("sub") для безопасности
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def get_user(db_session: Session, email: str) -> User | None:
    return db_session.query(User).filter(User.email == email).first()


def authenticate_user(db_session: Session, email: str, password: str) -> User | bool:
    user = get_user(db_session, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user


# Асинхронная функция для получения текущего пользователя из токена
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user