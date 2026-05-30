from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user_model import User

from app.schemas.user_schema import (
    UserRegister,
    UserLogin
)

from app.services.auth_service import (
    create_user
)

from app.core.security import (
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    created_user = create_user(
        db,
        user
    )

    return {
        "message": "User created successfully",
        "user": created_user
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    is_password_correct = verify_password(
        user.password,
        existing_user.password
    )

    if not is_password_correct:
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_access_token({
        "user_id": existing_user.id,
        "role": existing_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }