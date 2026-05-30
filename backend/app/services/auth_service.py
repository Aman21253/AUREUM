from sqlalchemy.orm import Session

from app.models.user_model import User

from app.schemas.user_schema import (
    UserRegister
)

from app.core.security import (
    hash_password
)


def create_user(
    db: Session,
    user: UserRegister
):

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user