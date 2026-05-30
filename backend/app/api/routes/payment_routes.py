import os
import razorpay

from fastapi import APIRouter
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)

@router.post("/create-order")
def create_order(data: dict):

    amount = int(data["amount"]) * 100

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "order": order,
        "key": os.getenv("RAZORPAY_KEY_ID")
    }