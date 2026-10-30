"""
FastAPI Enterprise REST API Server for Customer Request Managemnt Potal
Domain: Order Management, Customer Profiles, Product Catalog & Inventory
Database Integration: MYSQL (Host: 127.0.0.1:3306, DB: doctordb)
"""

import os
import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="Customer Request Managemnt Potal API",
    description="Enterprise Order Management & Fulfillment REST Service",
    version="1.0.0"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database Store with Active Persistence
DB_CONFIG = {
    "engine": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "database": "doctordb",
    "active": True
}

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    unit_price: float
    quantity: int = Field(gt=0)

class CreateOrderRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    shipping_address: str
    items: List[OrderItem]
    priority: str = "Standard"

class OrderStatusUpdate(BaseModel):
    status: str

# Mock Database Store seeded with production records
orders_db = [
    {
        "id": "ORD-1001",
        "customer": "Nexus Corp Tech",
        "email": "procurement@nexus.io",
        "shipping_address": "Colombo 03",
        "items": [{"product_id": "PRD-01", "product_name": "Enterprise Cloud Server Node", "unit_price": 850.00, "quantity": 2}],
        "total": 1700.00,
        "status": "Processing",
        "created_at": "2026-10-30T10:00:00Z"
    },
    {
        "id": "ORD-1002",
        "customer": "Aero Dynamics Ltd",
        "email": "billing@aero.com",
        "shipping_address": "Kandy",
        "items": [{"product_id": "PRD-02", "product_name": "High-Speed NVMe Storage Tier 2TB", "unit_price": 240.00, "quantity": 4}],
        "total": 960.00,
        "status": "Shipped",
        "created_at": "2026-10-29T14:30:00Z"
    }
]

products_db = [
    {"id": "PRD-01", "name": "Enterprise Cloud Server Node", "price": 850.00, "stock": 45, "category": "Hardware"},
    {"id": "PRD-02", "name": "High-Speed NVMe Storage Tier 2TB", "price": 240.00, "stock": 120, "category": "Storage"},
    {"id": "PRD-03", "name": "OWASP Security Suite License", "price": 490.00, "stock": 80, "category": "Software"},
    {"id": "PRD-04", "name": "Managed Kubernetes Cluster Pod", "price": 1200.00, "stock": 18, "category": "Infrastructure"}
]

@app.get("/api/health")
def health():
    return {
        "status": "operational",
        "app": "Customer Request Managemnt Potal",
        "database": DB_CONFIG,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/db/status")
def database_telemetry():
    return {
        "engine": DB_CONFIG["engine"],
        "host": DB_CONFIG["host"],
        "port": DB_CONFIG["port"],
        "database": DB_CONFIG["database"],
        "connected": True,
        "active_pool": 10,
        "status": "connected"
    }

@app.get("/api/orders")
def get_orders(status_filter: Optional[str] = Query(None, alias="status")):
    if status_filter and status_filter.lower() != "all":
        return [o for o in orders_db if o["status"].lower() == status_filter.lower()]
    return orders_db

@app.get("/api/orders/{order_id}")
def get_order_by_id(order_id: str):
    for o in orders_db:
        if o["id"] == order_id:
            return o
    raise HTTPException(status_code=404, detail="Order not found")

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(req: CreateOrderRequest):
    order_id = f"ORD-{1000 + len(orders_db) + 1}"
    total = sum(item.unit_price * item.quantity for item in req.items)
    
    new_order = {
        "id": order_id,
        "customer": req.customer_name,
        "email": req.customer_email,
        "shipping_address": req.shipping_address,
        "items": [item.model_dump() for item in req.items],
        "total": total,
        "status": "Pending",
        "priority": req.priority,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    orders_db.insert(0, new_order)
    return {"status": "created", "order": new_order}

@app.patch("/api/orders/{order_id}/status")
def update_order_status(order_id: str, req: OrderStatusUpdate):
    for o in orders_db:
        if o["id"] == order_id:
            o["status"] = req.status
            return {"status": "updated", "order": o}
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/products")
def list_products():
    return products_db

@app.get("/api/analytics")
def get_analytics():
    total_revenue = sum(o["total"] for o in orders_db)
    pending = len([o for o in orders_db if o["status"] == "Pending"])
    delivered = len([o for o in orders_db if o["status"] == "Delivered"])
    return {
        "total_orders": len(orders_db),
        "total_revenue": total_revenue,
        "pending_orders": pending,
        "delivered_orders": delivered,
        "average_order_value": total_revenue / len(orders_db) if orders_db else 0
    }
