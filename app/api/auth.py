from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, Token
from app.models.user import User
from app.core.security import get_password_hash
from app.core.auth import authenticate_user, create_access_token
from app.core.config import settings
from datetime import timedelta
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered" # <-- Изменить сообщение
        )

    if len(user.password.encode('utf-8')) > 72:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be no longer than 72 bytes"
        )

    db_user = User(email=user.email, hashed_password=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"msg": "User created successfully"}


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token( data={"sub": user.email}, expires_delta=access_token_expires )
    return {"access_token": access_token, "token_type": "bearer"}