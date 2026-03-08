# Complete API Documentation

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0  
**Last Updated:** March 8, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [Restaurantes Endpoints](#restaurantes-endpoints)
5. [Usuarios Endpoints](#usuarios-endpoints)
6. [MenuItems Endpoints](#menuitems-endpoints)
7. [Ordenes Endpoints](#ordenes-endpoints)
8. [Reseñas Endpoints](#reseñas-endpoints)
9. [Error Handling](#error-handling)
10. [Pagination](#pagination)

---

## Overview

### Project Statistics
- **Total Restaurants:** 25,359
- **Total Menu Items:** 165,459
- **Total Users:** 10,000
- **Total Orders:** 25,027
- **Total Reviews:** 3,136
- **Database:** MongoDB
- **Framework:** Express.js + Node.js

### Key Features
✅ Geolocation-based restaurant search (Haversine formula)  
✅ Multi-item order support with bulkWrite optimization  
✅ Coherent review generation (9 cuisines × 5 rating levels)  
✅ Pagination support on all list endpoints  
✅ Soft delete for restaurants  
✅ Order status tracking  

---

## Authentication

Currently **no authentication** is implemented. For production deployment, implement:

1. **JWT Token-based Auth**
   ```
   Authorization: Bearer {token}
   ```

2. **Protected Endpoints:**
   - All POST/PUT/DELETE operations
   - User-specific data retrieval

3. **Example Protected Request:**
   ```
   GET /usuarios/me
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Data Models

### Restaurante Schema
```javascript
{
  _id: ObjectId,
  restaurant_id: String (unique),
  name: String,
  cuisine: String,
  address: {
    building: String,
    street: String,
    zipcode: String,
    borough: String,
    coord: [Number, Number] // [longitude, latitude]
  },
  ratingPromedio: Number (0-5),
  totalResenas: Number,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Usuario Schema
```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (unique),
  password: String (hashed),
  address: {
    building: String,
    street: String,
    zipcode: String,
    borough: String,
    coord: [Number, Number] // [longitude, latitude]
  },
  telefono: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Schema
```javascript
{
  _id: ObjectId,
  restauranteId: ObjectId,
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  disponible: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orden Schema
```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId,
  restauranteId: ObjectId,
  items: [
    {
      menuItemId: ObjectId,
      nombre: String,
      precioUnitario: Number,
      cantidad: Number,
      subtotal: Number
    }
  ],
  montoTotal: Number,
  estado: String, // PENDIENTE, CONFIRMADA, EN_PREPARACION, LISTA, ENTREGADA, CANCELADA
  createdAt: Date,
  updatedAt: Date
}
```

### Reseña Schema
```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId,
  restauranteId: ObjectId,
  ordenId: ObjectId,
  rating: Number (1-5),
  comentario: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Restaurantes Endpoints

### 1. Create Restaurant
**POST** `/restaurantes`

**Request Body:**
```json
{
  "name": "Joe's Italian Restaurant",
  "cuisine": "Italian",
  "restaurant_id": "rest-12345",
  "address": {
    "building": "256",
    "street": "Broadway",
    "zipcode": "10012",
    "borough": "Manhattan",
    "coord": [-73.9776, 40.7304]
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Joe's Italian Restaurant",
    "cuisine": "Italian",
    "restaurant_id": "rest-12345",
    "ratingPromedio": 0,
    "totalResenas": 0,
    "activo": true,
    "createdAt": "2026-03-08T10:30:00Z"
  }
}
```

---

### 2. Get All Restaurants
**GET** `/restaurantes`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `sort` (optional, default: _id)
- `order` (optional: asc|desc)

**Example:**
```
GET /restaurantes?page=1&limit=20&sort=name&order=asc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Joe's Italian Restaurant",
      "cuisine": "Italian",
      "ratingPromedio": 4.5,
      "totalResenas": 245
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25359,
    "pages": 1268
  }
}
```

---

### 3. Get Restaurant by ID
**GET** `/restaurantes/{restaurantId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Joe's Italian Restaurant",
    "cuisine": "Italian",
    "address": {
      "building": "256",
      "street": "Broadway",
      "zipcode": "10012",
      "borough": "Manhattan",
      "coord": [-73.9776, 40.7304]
    },
    "ratingPromedio": 4.5,
    "totalResenas": 245
  }
}
```

---

### 4. Update Restaurant
**PUT** `/restaurantes/{restaurantId}`

**Request Body:**
```json
{
  "name": "Joe's Italian Restaurant - Updated",
  "cuisine": "Italian-American",
  "ratingPromedio": 4.7
}
```

---

### 5. Delete Restaurant (Soft Delete)
**DELETE** `/restaurantes/{restaurantId}`

**Response:**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

### 6. Find Nearby Restaurants (Geospatial)
**POST** `/restaurantes/buscar/cercanos`

**Request Body:**
```json
{
  "coordinates": [-73.9776, 40.7304],
  "maxDistance": 5000
}
```

**Parameters:**
- `coordinates`: [longitude, latitude]
- `maxDistance`: Maximum distance in meters (default: 5000)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Joe's Italian Restaurant",
      "cuisine": "Italian",
      "distance": 2150,
      "ratingPromedio": 4.5
    }
  ]
}
```

---

### 7. Update Restaurant Rating
**PUT** `/restaurantes/{restaurantId}/rating`

**Request Body:**
```json
{
  "ratingPromedio": 4.8,
  "totalResenas": 256
}
```

---

## Usuarios Endpoints

### 1. Register New User
**POST** `/usuarios/registro`

**Request Body:**
```json
{
  "nombre": "Juan García",
  "email": "juan.garcia@example.com",
  "password": "SecurePassword123!",
  "address": {
    "building": "789",
    "street": "5th Avenue",
    "zipcode": "10001",
    "borough": "Manhattan"
  },
  "telefono": "(212) 555-0123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Juan García",
    "email": "juan.garcia@example.com",
    "telefono": "(212) 555-0123",
    "createdAt": "2026-03-08T10:30:00Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 2. Login User
**POST** `/usuarios/login`

**Request Body:**
```json
{
  "email": "juan.garcia@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Juan García",
    "email": "juan.garcia@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get All Users
**GET** `/usuarios`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

### 4. Get User by ID
**GET** `/usuarios/{userId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Juan García",
    "email": "juan.garcia@example.com",
    "address": {
      "building": "789",
      "street": "5th Avenue",
      "borough": "Manhattan"
    },
    "telefono": "(212) 555-0123"
  }
}
```

---

### 5. Update User
**PUT** `/usuarios/{userId}`

**Request Body:**
```json
{
  "nombre": "Juan García López",
  "telefono": "(212) 555-0456"
}
```

---

### 6. Delete User
**DELETE** `/usuarios/{userId}`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## MenuItems Endpoints

### 1. Create Menu Item
**POST** `/menuItems`

**Request Body:**
```json
{
  "restauranteId": "507f1f77bcf86cd799439011",
  "nombre": "Pasta Carbonara",
  "descripcion": "Classic Italian pasta with bacon, egg, and parmesan sauce",
  "precio": 14.99,
  "categoria": "Pasta",
  "disponible": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "restauranteId": "507f1f77bcf86cd799439011",
    "nombre": "Pasta Carbonara",
    "precio": 14.99,
    "disponible": true
  }
}
```

---

### 2. Get All Menu Items
**GET** `/menuItems`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (default: nombre)

**Example:**
```
GET /menuItems?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "nombre": "Pasta Carbonara",
      "precio": 14.99,
      "disponible": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 165459,
    "pages": 3310
  }
}
```

---

### 3. Get Menu Items by Restaurant
**GET** `/menuItems/restaurante/{restaurantId}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Example:**
```
GET /menuItems/restaurante/507f1f77bcf86cd799439011?limit=20
```

---

### 4. Get Menu Item by ID
**GET** `/menuItems/{itemId}`

---

### 5. Update Menu Item
**PUT** `/menuItems/{itemId}`

**Request Body:**
```json
{
  "precio": 15.99,
  "disponible": false,
  "descripcion": "Temporarily out of stock"
}
```

---

### 6. Delete Menu Item
**DELETE** `/menuItems/{itemId}`

---

## Ordenes Endpoints

### 1. Create Order
**POST** `/ordenes`

**Request Body:**
```json
{
  "usuarioId": "507f1f77bcf86cd799439012",
  "restauranteId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439013",
      "nombre": "Pasta Carbonara",
      "precioUnitario": 14.99,
      "cantidad": 2
    },
    {
      "menuItemId": "507f1f77bcf86cd799439014",
      "nombre": "Caesar Salad",
      "precioUnitario": 8.99,
      "cantidad": 1
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "usuarioId": "507f1f77bcf86cd799439012",
    "restauranteId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "menuItemId": "507f1f77bcf86cd799439013",
        "nombre": "Pasta Carbonara",
        "precioUnitario": 14.99,
        "cantidad": 2,
        "subtotal": 29.98
      }
    ],
    "montoTotal": 38.97,
    "estado": "PENDIENTE",
    "createdAt": "2026-03-08T10:30:00Z"
  }
}
```

---

### 2. Get All Orders
**GET** `/ordenes`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

### 3. Get Order by ID
**GET** `/ordenes/{orderId}`

---

### 4. Update Order Items (Before Confirmation)
**PUT** `/ordenes/{orderId}`

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439013",
      "nombre": "Pasta Carbonara",
      "precioUnitario": 14.99,
      "cantidad": 3
    }
  ]
}
```

---

### 5. Update Order Status
**PUT** `/ordenes/{orderId}/estado`

**Request Body:**
```json
{
  "estado": "EN_PREPARACION"
}
```

**Valid States:**
- `PENDIENTE` - Order created, awaiting confirmation
- `CONFIRMADA` - Order confirmed by restaurant
- `EN_PREPARACION` - Restaurant is preparing the order
- `LISTA` - Order is ready for pickup/delivery
- `ENTREGADA` - Order delivered to customer
- `CANCELADA` - Order cancelled

---

### 6. Cancel Order
**DELETE** `/ordenes/{orderId}`

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

### 7. Get User's Orders
**GET** `/ordenes/usuario/{userId}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

### 8. Get Orders by Restaurant
**GET** `/ordenes/restaurante/{restaurantId}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

## Reseñas Endpoints

### 1. Create Review
**POST** `/reseñas`

**Request Body:**
```json
{
  "usuarioId": "507f1f77bcf86cd799439012",
  "restauranteId": "507f1f77bcf86cd799439011",
  "ordenId": "507f1f77bcf86cd799439015",
  "rating": 5,
  "comentario": "Excellent food and service! The pasta was perfectly cooked."
}
```

**Requirements:**
- Associated order must have `estado: "ENTREGADA"`
- Rating must be 1-5
- Comment must be at least 10 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "usuarioId": "507f1f77bcf86cd799439012",
    "restauranteId": "507f1f77bcf86cd799439011",
    "ordenId": "507f1f77bcf86cd799439015",
    "rating": 5,
    "comentario": "Excellent food and service!...",
    "createdAt": "2026-03-08T10:35:00Z"
  }
}
```

---

### 2. Get All Reviews
**GET** `/reseñas`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

### 3. Get Review by ID
**GET** `/reseñas/{reviewId}`

---

### 4. Update Review
**PUT** `/reseñas/{reviewId}`

**Request Body:**
```json
{
  "rating": 4,
  "comentario": "Very good food, but service could be faster."
}
```

---

### 5. Delete Review
**DELETE** `/reseñas/{reviewId}`

---

### 6. Get Restaurant Reviews
**GET** `/reseñas/restaurante/{restaurantId}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

### 7. Get User Reviews
**GET** `/reseñas/usuario/{userId}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Description of the error",
  "errorCode": "ERROR_TYPE"
}
```

### Common Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_INPUT` | 400 | Missing or invalid request fields |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `RESTAURANT_NOT_FOUND` | 404 | Restaurant doesn't exist |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `ORDER_NOT_FOUND` | 404 | Order doesn't exist |
| `INVALID_STATUS` | 400 | Invalid order status |
| `ORDER_NOT_DELIVERED` | 400 | Cannot review non-delivered order |
| `INVALID_RATING` | 400 | Rating must be 1-5 |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Pagination

All list endpoints support pagination with these parameters:

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | int | 1 | N/A |
| `limit` | int | 10 | 100 |

**Example:**
```
GET /restaurantes?page=3&limit=50
```

**Response Structure:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 3,
    "limit": 50,
    "total": 25359,
    "pages": 508
  }
}
```

---

## Testing Examples

### cURL
```bash
# Get all restaurants
curl -X GET http://localhost:5000/api/restaurantes

# Create a new user
curl -X POST http://localhost:5000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Maria Lopez",
    "email": "maria@example.com",
    "password": "SecurePass123!",
    "address": {"building": "100", "street": "Park Ave", "zipcode": "10005", "borough": "Manhattan"},
    "telefono": "(212) 555-1234"
  }'
```

---

## Version Information

**Current Version:** 1.0  
**API Stability:** Production-ready  
**Last Updated:** March 8, 2026  

For bug reports or feature requests, please contact the development team.
