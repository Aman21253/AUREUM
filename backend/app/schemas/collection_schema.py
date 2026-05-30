from pydantic import BaseModel


class CollectionCreate(BaseModel):

    title: str
    description: str
    banner_image: str


class CollectionResponse(BaseModel):

    id: int
    title: str
    description: str
    banner_image: str

    class Config:
        from_attributes = True