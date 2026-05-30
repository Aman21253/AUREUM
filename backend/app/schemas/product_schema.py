from pydantic import BaseModel
from typing import Optional


class ProductResponse(BaseModel):

    id: int
    collection_id: int
    title: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    stock: int
    category: Optional[str] = None
    brand: Optional[str] = None
    main_image: Optional[str] = None
    gallery: Optional[str] = None
    sizes: Optional[str] = None
    colors: Optional[str] = None
    is_featured: bool = False

    class Config:
        from_attributes = True