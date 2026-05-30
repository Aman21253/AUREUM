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

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.collection_model import Collection
from app.models.product_model import Product

from app.schemas.collection_schema import CollectionResponse
from app.schemas.product_schema import ProductResponse

from app.core.auth import admin_required

UPLOAD_DIR = "uploads/collections"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)


@router.post(
    "/",
    response_model=CollectionResponse
)
def create_collection(
    title: str = Form(...),
    description: str = Form(""),
    banner_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    image_url = None

    if banner_image and banner_image.filename:
        ext = os.path.splitext(banner_image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(banner_image.file, buffer)

        image_url = f"/{file_path}"

    new_collection = Collection(
        title=title,
        description=description,
        banner_image=image_url
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return new_collection


@router.get(
    "/",
    response_model=list[CollectionResponse]
)
def get_collections(
    db: Session = Depends(get_db)
):
    return db.query(Collection).all()


# ✅ Must be BEFORE /{collection_id} to avoid route conflict
@router.get(
    "/{collection_id}/products",
    response_model=list[ProductResponse]
)
def get_collection_products(
    collection_id: int,
    db: Session = Depends(get_db)
):
    collection = db.query(Collection).filter(
        Collection.id == collection_id
    ).first()

    if not collection:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    products = db.query(Product).filter(
        Product.collection_id == collection_id
    ).all()

    return products


@router.get(
    "/{collection_id}",
    response_model=CollectionResponse
)
def get_single_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    collection = db.query(Collection).filter(
        Collection.id == collection_id
    ).first()

    if not collection:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return collection


@router.put(
    "/{collection_id}",
    response_model=CollectionResponse
)
def update_collection(
    collection_id: int,
    title: str = Form(...),
    description: str = Form(""),
    banner_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    existing_collection = db.query(Collection).filter(
        Collection.id == collection_id
    ).first()

    if not existing_collection:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    existing_collection.title = title
    existing_collection.description = description

    if banner_image and banner_image.filename:
        ext = os.path.splitext(banner_image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(banner_image.file, buffer)

        existing_collection.banner_image = f"/{file_path}"

    db.commit()
    db.refresh(existing_collection)

    return existing_collection


@router.delete("/{collection_id}")
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    collection = db.query(Collection).filter(
        Collection.id == collection_id
    ).first()

    if not collection:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    db.delete(collection)
    db.commit()

    return {"message": "Collection deleted successfully"}