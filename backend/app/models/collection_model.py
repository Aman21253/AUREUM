from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from datetime import (
    datetime,
    timezone
)

from app.database.db import Base


class Collection(Base):

    __tablename__ = "collections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )
    description = Column(Text)
    banner_image = Column(String)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )