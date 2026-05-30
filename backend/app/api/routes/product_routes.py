import os
import uuid
import shutil

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from typing import Optional
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.product_model import Product
from app.schemas.product_schema import ProductResponse
from app.core.auth import admin_required

UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post(
    "/",
    response_model=ProductResponse
)
def create_product(
    collection_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    discount_price: Optional[float] = Form(None),
    stock: int = Form(...),
    category: str = Form(""),
    brand: str = Form(""),
    sizes: str = Form(""),
    colors: str = Form(""),
    is_featured: bool = Form(False),
    main_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    image_url = None

    if main_image and main_image.filename:
        ext = os.path.splitext(main_image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(main_image.file, buffer)

        image_url = f"/{file_path}"

    new_product = Product(
        collection_id=collection_id,
        title=title,
        description=description,
        price=price,
        discount_price=discount_price,
        stock=stock,
        category=category,
        brand=brand,
        main_image=image_url,
        sizes=sizes,
        colors=colors,
        is_featured=is_featured
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(
    search: str = None,
    category: str = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))

    if category:
        query = query.filter(Product.category == category)

    return query.offset(skip).limit(limit).all()


@router.get(
    "/featured",
    response_model=list[ProductResponse]
)
def featured_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_featured == True).all()


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_single_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    collection_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    discount_price: Optional[float] = Form(None),
    stock: int = Form(...),
    category: str = Form(""),
    brand: str = Form(""),
    sizes: str = Form(""),
    colors: str = Form(""),
    is_featured: bool = Form(False),
    main_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    existing_product = db.query(Product).filter(Product.id == product_id).first()

    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_product.collection_id = collection_id
    existing_product.title = title
    existing_product.description = description
    existing_product.price = price
    existing_product.discount_price = discount_price
    existing_product.stock = stock
    existing_product.category = category
    existing_product.brand = brand
    existing_product.sizes = sizes
    existing_product.colors = colors
    existing_product.is_featured = is_featured

    if main_image and main_image.filename:
        ext = os.path.splitext(main_image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(main_image.file, buffer)

        existing_product.main_image = f"/{file_path}"

    db.commit()
    db.refresh(existing_product)

    return existing_product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}