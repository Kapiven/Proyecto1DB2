# Complete API Endpoints Reference

**Base URL:** `http://localhost:5000/api`  
**Last Updated:** March 8, 2026

---

## 📚 Endpoints Summary

- **Restaurantes:** 7 endpoints
- **Usuarios:** 6 endpoints  
- **MenuItems:** 6 endpoints
- **Ordenes:** 8 endpoints
- **Reseñas:** 6 endpoints

**Total:** 33 endpoints

---

## 📍 RESTAURANTES (Restaurants)

### Create Restaurant
```
POST /restaurantes
Content-Type: application/json

{
  "name": "Restaurant Name",
  "cuisine": "Italian",
  "restaurant_id": "unique-id-123",
  "address": {
    "building": "256",
    "street": "Broadway",
    "zipcode": "10012",
    "borough": "Manhattan",
    "coord": [-73.9776, 40.7304]
  }
}
```

### Get All Restaurants (Paginated)
```
GET /restaurantes?page=1&limit=10
```

### Get Restaurant by ID
```
GET /restaurantes/{restaurantId}
```

### Update Restaurant
```
PUT /restaurantes/{restaurantId}

{
  "name": "Updated Name",
  "cuisine": "French"
}
```

### Delete Restaurant (Soft Delete)
```
DELETE /restaurantes/{restaurantId}
```

### Find Nearby Restaurants (Geospatial)
```
POST /restaurantes/buscar/cercanos
Content-Type: application/json

{
  "coordinates": [-73.9776, 40.7304],
  "maxDistance": 5000
}
```

### Update Restaurant Rating
```
PUT /restaurantes/{restaurantId}/rating
Content-Type: application/json

{
  "ratingPromedio": 4.5,
  "totalResenas": 245
}
```

---

## 👥 USUARIOS (Users)

### Register New User
```
POST /usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan García",
  "email": "juan@example.com",
  "password": "password123",
  "address": {
    "building": "789",
    "street": "5th Avenue",
    "zipcode": "10001",
    "borough": "Manhattan"
  },
  "telefono": "(212) 555-0123"
}
```

### Login User
```
POST /usuarios/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Get All Users
```
GET /usuarios?page=1&limit=10
```

### Get User by ID
```
GET /usuarios/{userId}
```

### Update User
```
PUT /usuarios/{userId}
Content-Type: application/json

{
  "nombre": "Updated Name",
  "telefono": "(212) 555-0456"
}
```

### Delete User
```
DELETE /usuarios/{userId}
```

---

## 🍽️ MENUITEMS (Menu Items)

### Create Menu Item
```
POST /menuItems
Content-Type: application/json

{
  "restauranteId": "{restaurantId}",
  "nombre": "Pasta Carbonara",
  "descripcion": "Classic Italian pasta with bacon and egg sauce",
  "precio": 14.99,
  "categoria": "Pasta",
  "disponible": true
}
```

### Get All Menu Items
```
GET /menuItems?page=1&limit=20
```

### Get Menu Items by Restaurant
```
GET /menuItems/restaurante/{restaurantId}
```

### Get Menu Item by ID
```
GET /menuItems/{itemId}
```

### Update Menu Item
```
PUT /menuItems/{itemId}
Content-Type: application/json

{
  "precio": 15.99,
  "disponible": false
}
```

### Delete Menu Item
```
DELETE /menuItems/{itemId}
```

---

## 🛒 ORDENES (Orders)

### Create Order (Multi-item)
```
POST /ordenes
Content-Type: application/json

{
  "usuarioId": "{userId}",
  "restauranteId": "{restaurantId}",
  "items": [
    {
      "menuItemId": "{itemId1}",
      "nombre": "Pasta Carbonara",
      "precioUnitario": 14.99,
      "cantidad": 2
    },
    {
      "menuItemId": "{itemId2}",
      "nombre": "Caesar Salad",
      "precioUnitario": 8.99,
      "cantidad": 1
    }
  ]
}
```

### Get All Orders
```
GET /ordenes?page=1&limit=10
```

### Get Order by ID
```
GET /ordenes/{orderId}
```

### Update Order (Before Confirmation)
```
PUT /ordenes/{orderId}
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "{itemId1}",
      "nombre": "Item Name",
      "precioUnitario": 12.99,
      "cantidad": 1
    }
  ]
}
```

### Update Order Status
```
PUT /ordenes/{orderId}/estado
Content-Type: application/json

{
  "estado": "ENTREGADA"
}
```

Valid states: `PENDIENTE`, `CONFIRMADA`, `EN_PREPARACION`, `LISTA`, `ENTREGADA`, `CANCELADA`

### Cancel Order
```
DELETE /ordenes/{orderId}
```

### Get User's Orders
```
GET /ordenes/usuario/{userId}?page=1&limit=10
```

### Get Orders by Restaurant
```
GET /ordenes/restaurante/{restaurantId}?page=1&limit=10
```

---

## ⭐ RESEÑAS (Reviews)

### Create Review (Only for Delivered Orders)
```
POST /resenas
Content-Type: application/json

{
  "usuarioId": "{userId}",
  "restauranteId": "{restaurantId}",
  "ordenId": "{orderId}",
  "rating": 5,
  "comentario": "Absolutely perfect! The pasta was cooked to perfection..."
}
```

### Get All Reviews
```
GET /resenas?page=1&limit=10
```

### Get Review by ID
```
GET /resenas/{reviewId}
```

### Update Review (Only if Order ENTREGADA)
```
PUT /resenas/{reviewId}
Content-Type: application/json

{
  "rating": 4,
  "comentario": "Very good Italian restaurant..."
}
```

### Delete Review
```
DELETE /resenas/{reviewId}
```

### Get Restaurant Reviews
```
GET /resenas/restaurante/{restaurantId}?page=1&limit=10
```

### Get User Reviews
```
GET /resenas/usuario/{userId}?page=1&limit=10
```

---

## 🔍 Common Query Parameters

All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (e.g., `sort=nombre`)
- `order` - Sort order: `asc` or `desc`

Example:
```
GET /restaurantes?page=2&limit=20&sort=nombre&order=asc
```

---

## 📊 Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "pages": 25
  }
}
```

### Error Response (400, 404, 500)
```json
{
  "success": false,
  "error": "Error message",
  "errorCode": "ERROR_CODE"
}
```

---

## ⚠️ Common HTTP Status Codes

- **200:** OK - Request successful
- **201:** Created - Resource created successfully
- **400:** Bad Request - Invalid input
- **404:** Not Found - Resource doesn't exist
- **409:** Conflict - Duplicate email or conflict
- **500:** Internal Server Error - Server error

---

## 🔐 Authentication Notes

Currently, no JWT authentication is implemented. For production:
- Implement JWT tokens
- Add Bearer token headers
- Protect sensitive endpoints
- Validate user ownership

---

## 📈 Rate Limits

No rate limiting currently implemented. For production:
- Implement rate limiting
- Use Redis for session management
- Add API key validation

---

## 🧪 Testing Tools

### Using cURL
```bash
curl -X GET http://localhost:5000/api/restaurantes
```

### Using Postman
Import the endpoints and test collections available in the project.

### Using HTTPie
```bash
http GET http://localhost:5000/api/restaurantes
```

## 🍕 MENU ITEMS

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/menu-items` | Create menu item |
| GET | `/menu-items/restaurante/:restauranteId` | Get restaurant menu |
| GET | `/menu-items/:id` | Get menu item by ID |
| PUT | `/menu-items/:id` | Update menu item |
| PATCH | `/menu-items/:id/disponibilidad` | Change availability |
| DELETE | `/menu-items/:id` | Delete menu item |

**Create Menu Item:**
```json
POST /menu-items
{
  "restauranteId": "ObjectId",
  "nombre": "Pizza Margherita",
  "descripcion": "Tomate, mozzarella, albahaca",
  "precio": 12.99,
  "categoria": "Pizza"
}
```

---

## 📦 ORDENES (Orders)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ordenes` | Create new order |
| GET | `/ordenes/usuario/:usuarioId` | Get user orders |
| GET | `/ordenes/restaurante/:restauranteId` | Get restaurant orders |
| GET | `/ordenes/:id` | Get order by ID |
| GET | `/ordenes/estado/:estado` | Get orders by status |
| PATCH | `/ordenes/:id/estado` | Update order status |
| PATCH | `/ordenes/:id/cancelar` | Cancel order |

**Create Order:**
```json
POST /ordenes
{
  "usuarioId": "ObjectId",
  "restauranteId": "ObjectId",
  "items": [
    {
      "menuItemId": "ObjectId",
      "cantidad": 2
    }
  ],
  "direccionEntrega": "Calle Destino 789",
  "comentarios": "Sin cebolla"
}
```

**Order Status Values:**
- `PENDIENTE` - Initial state
- `CONFIRMADA` - Order confirmed
- `EN_PREPARACION` - Being prepared
- `LISTA` - Ready for pickup
- `ENTREGADA` - Delivered
- `CANCELADA` - Cancelled

---

## ⭐ RESEÑAS (Reviews)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resenas` | Create review |
| GET | `/resenas/restaurante/:restauranteId` | Get restaurant reviews |
| GET | `/resenas/usuario/:usuarioId` | Get user reviews |
| GET | `/resenas/:id` | Get review by ID |
| GET | `/resenas/restaurante/:restauranteId/estadisticas` | Get review statistics |
| PUT | `/resenas/:id` | Update review |
| DELETE | `/resenas/:id` | Delete review |

**Create Review:**
```json
POST /resenas
{
  "usuarioId": "ObjectId",
  "restauranteId": "ObjectId",
  "ordenId": "ObjectId",
  "rating": 5,
  "comentario": "Excelente servicio"
}
```

**Review Statistics Response:**
```json
{
  "totalResenas": 15,
  "ratingPromedio": "4.67",
  "distribucion": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 5,
    "5": 7
  }
}
```

---

## 🏥 HEALTH & INFO

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and documentation |
| GET | `/health` | Server health status |

**Health Response:**
```json
{
  "status": "Server is running",
  "database": "Connected"
}
```

---

## 📊 Complete Workflow Example

### 1. Register User
```bash
POST /api/usuarios/registro
{
  "nombre": "Juan",
  "email": "juan@example.com",
  "password": "pass123",
  "direccion": "Calle 123",
  "telefono": "555-1234"
}
# Returns: { _id: "userId", ... }
```

### 2. Create Restaurant
```bash
POST /api/restaurantes
{
  "nombre": "La Pizza",
  "descripcion": "Pizza italiana",
  "categoria": "Italiana",
  "coordenadas": [-74.0060, 40.7128],
  "direccion": "Calle 456",
  "telefono": "555-5678"
}
# Returns: { _id: "restaurantId", ... }
```

### 3. Add Menu Items
```bash
POST /api/menu-items
{
  "restauranteId": "restaurantId",
  "nombre": "Pizza Margherita",
  "descripcion": "Tomate, mozzarella",
  "precio": 12.99,
  "categoria": "Pizza"
}
# Returns: { _id: "itemId", ... }
```

### 4. Create Order
```bash
POST /api/ordenes
{
  "usuarioId": "userId",
  "restauranteId": "restaurantId",
  "items": [
    {
      "menuItemId": "itemId",
      "cantidad": 2
    }
  ],
  "direccionEntrega": "Calle Destino"
}
# Returns: { _id: "orderId", total: 25.98, ... }
```

### 5. Update Order Status
```bash
PATCH /api/ordenes/orderId/estado
{
  "nuevoEstado": "ENTREGADA"
}
```

### 6. Create Review
```bash
POST /api/resenas
{
  "usuarioId": "userId",
  "restauranteId": "restaurantId",
  "ordenId": "orderId",
  "rating": 5,
  "comentario": "Excelente"
}
```

### 7. Get Statistics
```bash
GET /api/resenas/restaurante/restaurantId/estadisticas
# Returns review stats with distribution
```

---

## 🔍 Query Tips

### Get Recent Orders
```bash
GET /api/ordenes/usuario/userId
# Returns sorted by date (newest first)
```

### Find Available Items
```bash
GET /api/menu-items/restaurante/restaurantId
# Returns only disponible: true items
```

### Search Nearby Restaurants
```bash
POST /api/restaurantes/buscar/cercanos
{
  "longitude": -74.0060,
  "latitude": 40.7128,
  "distancia": 10
}
```

### Filter Orders by Status
```bash
GET /api/ordenes/estado/ENTREGADA
# Returns all delivered orders
```

---

## 📋 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - GET, PUT |
| 201 | Created - POST |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔐 Security Notes

- Email must be unique per user
- Orders cannot be modified after delivery
- Reviews only for delivered orders
- Password hashing implemented
- CORS enabled

---

## 🧪 Testing Tools

- **Postman:** Full GUI for API testing
- **curl:** Command line tool
- **Thunder Client:** VS Code extension
- **Rest Client:** VS Code extension

---

## 💡 Common Operations

### Bulk Get All
```javascript
// All restaurants
GET /api/restaurantes

// All users
GET /api/usuarios

// All menu items of a restaurant
GET /api/menu-items/restaurante/:id
```

### Smart Search
```javascript
// Orders by user
GET /api/ordenes/usuario/:userId

// Orders by restaurant
GET /api/ordenes/restaurante/:restaurantId

// Orders by status
GET /api/ordenes/estado/PENDIENTE

// Reviews of restaurant
GET /api/resenas/restaurante/:id
```

### Changes & Updates
```javascript
// Update restaurant info
PUT /api/restaurantes/:id

// Change menu item availability
PATCH /api/menu-items/:id/disponibilidad

// Update order status
PATCH /api/ordenes/:id/estado

// Modify review
PUT /api/resenas/:id
```

---

**For detailed request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

**For quick testing, see [QUICK_START.md](QUICK_START.md)**
