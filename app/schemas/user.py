from pydantic import BaseModel, Field, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=1, max_length=72)


class UserLogin(UserBase):
    password: str = Field(..., min_length=1, max_length=72)


class UserInDB(UserBase):
    id: int
    hashed_password: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr | None = None 


