from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.database.db import (
    engine,
    Base
)

from app.models.user_model import User
from app.models.collection_model import Collection
from app.models.product_model import Product

from app.api.routes.auth_routes import (
    router as auth_router
)

from app.api.routes.collection_routes import (
    router as collection_router
)

from app.api.routes.product_routes import (
    router as product_router
)
from app.api.routes.user_routes import (
    router as user_router
)
from fastapi.staticfiles import StaticFiles
from app.api.routes.payment_routes import router as payment_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(collection_router)
app.include_router(product_router)
app.include_router(user_router)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(payment_router)


@app.get("/")
def home():

    return {
        "message": "Fashion API Running"
    }

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }