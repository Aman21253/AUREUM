from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    Text,
    Boolean,
    DateTime
)

from datetime import (
    datetime,
    timezone
)
from app.database.db import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    collection_id = Column(
        Integer,
        ForeignKey("collections.id")
    )
    title = Column(
        String,
        nullable=False
    )
    description = Column(Text)
    price = Column(Float)
    discount_price = Column(Float)
    stock = Column(Integer)
    category = Column(String)
    brand = Column(String)
    main_image = Column(String)
    gallery = Column(String)
    sizes = Column(String)
    colors = Column(String)
    is_featured = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )