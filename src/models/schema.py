"""
Domain Models and Entity Schemas for Customer Request Managemnt Potal
"""
from enum import Enum
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class OrderStatus(str, Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

class ProductItem(BaseModel):
    id: str
    name: str
    price: float
    stock: int
    category: str

class OrderLineItem(BaseModel):
    product_id: str
    product_name: str
    unit_price: float
    quantity: int = Field(gt=0)

class CustomerRecord(BaseModel):
    name: str
    email: EmailStr
    shipping_address: str
    total_spent: float = 0.0

class OrderEntity(BaseModel):
    id: str
    customer: str
    email: EmailStr
    shipping_address: str
    items: List[OrderLineItem]
    total: float
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
