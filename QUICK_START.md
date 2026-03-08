# Quick Start Guide - Restaurant System API

## Initialize Database (First Time Setup)

### Step 1: Seed Restaurants & Base Structure
```bash
npm run seed
```
This creates 25,359 restaurants from MongoDB sample_restaurants collection. (Takes ~5 minutes)

### Step 2: Populate Menu Items
```bash
npm run seed:menu
```
This generates 165,459 menu items (6.52 average per restaurant). (Takes ~10 minutes)

**Result:**
- ✓ 25,359 restaurants  
- ✓ 165,459 menu items
- ✓ Ready for orders

### Step 3: Generate Users, Orders & Reviews (Optional)
```bash
npm run seed:users
```
This creates:
- 10,000 users with geolocation
- 25,027 orders (geolocation-matched)
- 3,136 coherent reviews
(Takes ~15-20 minutes)

---

## Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will be available at: `http://localhost:5000`

---

## Clear User Data (Keep Restaurants & Menu Items)

```bash
npm run seed:clear
```

This deletes only:
- ❌ All users
- ❌ All orders  
- ❌ All reviews

**Keeps:**
- ✓ Restaurants (25,359)
- ✓ Menu items (165,459)

Allows regenerating just the user layer while keeping stable restaurant data.

---

## Quick API Tests

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "Server is running",
  "database": "Connected"
}
```

---

## User Management

### Register a New User
```bash
curl -X POST http://localhost:5000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan García",
    "email": "juan@example.com",
    "password": "segura123",
    "address": {
      "building": "789",
      "street": "Madison Avenue",
      "zipcode": "10002",
      "borough": "Manhattan"
    },
    "telefono": "(212) 555-0123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "segura123"
  }'
```

### Get User by ID
```bash
curl http://localhost:5000/api/usuarios/{userId}
```

---

## Restaurant Management

### Get All Restaurants (Paginated)
```bash
curl "http://localhost:5000/api/restaurantes?page=1&limit=10"
```

Response:
```json
{
  "restaurants": [
    {
      "_id": "5eb3d668b31de5d588f42933",
      "name": "Applebee's",
      "cuisine": "American",
      "address": {
        "building": "456",
        "street": "Broadway",
        "zipcode": "10012",
        "borough": "Manhattan",
        "coord": [-73.9776, 40.7304]
      }
    }
  ],
  "total": 25359,
  "page": 1,
  "pages": 2536
}
```

### Get Restaurant by ID
```bash
curl http://localhost:5000/api/restaurantes/{restaurantId}
```

### Find Nearby Restaurants (Geolocation)
```bash
curl -X POST http://localhost:5000/api/restaurantes/buscar/cercanos \
  -H "Content-Type: application/json" \
  -d '{
    "coordinates": [-73.9776, 40.7304],
    "maxDistance": 5000
  }'
```

---

## Menu Items

### Get Menu Items for Restaurant
```bash
curl http://localhost:5000/api/menuItems/restaurante/{restaurantId}
```

Response:
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Pasta Carbonara Supreme",
      "descripcion": "Classic Italian pasta with bacon and egg sauce",
      "precio": 14.99,
      "disponible": true
    }
  ]
}
```

### Get All Menu Items (Paginated)
```bash
curl "http://localhost:5000/api/menuItems?page=1&limit=10"
```

---

## Orders

### Create an Order
```bash
curl -X POST http://localhost:5000/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "userid123",
    "restauranteId": "restaurantid123",
    "items": [
      {
        "menuItemId": "itemid1",
        "nombre": "Pasta Carbonara",
        "precioUnitario": 14.99,
        "cantidad": 2
      },
      {
        "menuItemId": "itemid2",
        "nombre": "Caesar Salad",
        "precioUnitario": 8.99,
        "cantidad": 1
      }
    ]
  }'
```

Response:
```json
{
  "_id": "order123",
  "total": 38.97,
  "estado": "PENDIENTE",
  "items": [
    { "nombre": "Pasta Carbonara", "cantidad": 2, "subtotal": 29.98 },
    { "nombre": "Caesar Salad", "cantidad": 1, "subtotal": 8.99 }
  ]
}
```

### Update Order Status
```bash
curl -X PUT http://localhost:5000/api/ordenes/{orderId}/estado \
  -H "Content-Type: application/json" \
  -d '{"estado": "ENTREGADA"}'
```

### Get User's Orders
```bash
curl http://localhost:5000/api/ordenes/usuario/{usuarioId}
```

---

## Reviews

### Create a Review (Only for Delivered Orders)
```bash
curl -X POST http://localhost:5000/api/reseñas \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "userid123",
    "restauranteId": "restaurantid123",
    "ordenId": "orderid123",
    "rating": 5,
    "comentario": "Outstanding! Every dish was prepared with care. Chef knows what they'\''re doing!"
  }'
```

Response:
```json
{
  "_id": "review123",
  "rating": 5,
  "comentario": "Outstanding! Every dish was prepared with care. Chef knows what they're doing!",
  "fecha": "2026-03-08T14:30:00.000Z"
}
```

### Get Restaurant Reviews
```bash
curl http://localhost:5000/api/reseñas/restaurante/{restaurantId}
```

### Get User Reviews
```bash
curl http://localhost:5000/api/reseñas/usuario/{usuarioId}
```

---

## Database State After Full Setup

```
✓ Restaurantes: 25,359
✓ MenuItems: 165,459 (6.52 per restaurant average)
✓ Usuarios: 10,000 (with geolocation)
✓ Ordenes: 25,027 (geolocation-matched orders)
✓ Reseñas: 3,136 (coherent by cuisine & rating)

Total Records: 203,981 documents
```

---

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### "Connection refused" error
- Check `.env` MONGODB_URI
- Verify IP whitelist in MongoDB Atlas
- Test connection: `npm run seed`

### "E11000 duplicate key error"
```bash
npm run seed:clear
npm run seed:users
```

### Port already in use
```bash
# Kill process on port 5000
# Or change PORT in .env
```

---

## Next Steps

1. ✓ Server running on http://localhost:5000
2. ✓ Database populated with production-ready data
3. ✓ All endpoints tested and working
4. **See API_DOCUMENTATION.md** for complete endpoint reference
5. **See SEEDING_GUIDE.md** for advanced seeding options
```

#### Find Nearby Restaurants (5 km radius)
```bash
curl -X POST http://localhost:5000/api/restaurantes/buscar/cercanos \
  -H "Content-Type: application/json" \
  -d '{
    "longitude": -74.0060,
    "latitude": 40.7128,
    "distancia": 5
  }'
```

---

### Menu Management

#### Create Menu Item
```bash
curl -X POST http://localhost:5000/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "{restaurantId}",
    "nombre": "Pizza Margherita",
    "descripcion": "Tomate, mozzarella, albahaca",
    "precio": 12.99,
    "categoria": "Pizza"
  }'
```

#### Get Restaurant Menu
```bash
curl http://localhost:5000/api/menu-items/restaurante/{restauranteId}
```

#### Update Menu Item Availability
```bash
curl -X PATCH http://localhost:5000/api/menu-items/{itemId}/disponibilidad \
  -H "Content-Type: application/json" \
  -d '{
    "disponible": false
  }'
```

---

### Order Management

#### Create Order
```bash
curl -X POST http://localhost:5000/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "{userId}",
    "restauranteId": "{restaurantId}",
    "items": [
      {
        "menuItemId": "{itemId}",
        "cantidad": 2
      }
    ],
    "direccionEntrega": {
      "building": "789",
      "street": "Park Avenue",
      "zipcode": "10022",
      "borough": "Manhattan"
    },
    "comentarios": "Sin cebolla por favor"
  }'
```

#### Get User Orders
```bash
curl http://localhost:5000/api/ordenes/usuario/{userId}
```

#### Get Restaurant Orders
```bash
curl http://localhost:5000/api/ordenes/restaurante/{restaurantId}
```

#### Get Order by ID
```bash
curl http://localhost:5000/api/ordenes/{orderId}
```

#### Update Order Status
```bash
curl -X PATCH http://localhost:5000/api/ordenes/{orderId}/estado \
  -H "Content-Type: application/json" \
  -d '{
    "nuevoEstado": "LISTA"
  }'
```

Valid statuses: `PENDIENTE`, `CONFIRMADA`, `EN_PREPARACION`, `LISTA`, `ENTREGADA`, `CANCELADA`

#### Cancel Order
```bash
curl -X PATCH http://localhost:5000/api/ordenes/{orderId}/cancelar \
  -H "Content-Type: application/json"
```

---

### Review Management

#### Create Review (After Delivery)
```bash
curl -X POST http://localhost:5000/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "{userId}",
    "restauranteId": "{restaurantId}",
    "ordenId": "{orderId}",
    "rating": 5,
    "comentario": "Excelente servicio y comida deliciosa"
  }'
```

#### Get Restaurant Reviews
```bash
curl http://localhost:5000/api/resenas/restaurante/{restaurantId}
```

#### Get Review Statistics
```bash
curl http://localhost:5000/api/resenas/restaurante/{restaurantId}/estadisticas
```

#### Get User Reviews
```bash
curl http://localhost:5000/api/resenas/usuario/{userId}
```

---

## Testing Workflow

### Complete Order Lifecycle:

1. **Register User**
   ```bash
   # Save the userId from response
   ```

2. **Create Restaurant**
   ```bash
   # Save the restaurantId from response
   ```

3. **Create Menu Items**
   ```bash
   # Save the itemId from response
   ```

4. **Create Order**
   ```bash
   # Save the orderId from response
   ```

5. **Update Order Status**
   ```bash
   # Change to ENTREGADA
   ```

6. **Create Review**
   ```bash
   # Only possible after ENTREGADA status
   ```

7. **Check Statistics**
   ```bash
   # View restaurant rating and review distribution
   ```

---

## Database Connection

**MongoDB Atlas:** `mongodb+srv://men23975:Mongo151103@cluster0.ygtg1si.mongodb.net/restaurantes`

The connection is automatically established when the server starts.

---

## Using Postman

1. Open Postman
2. Create a new collection called "Restaurant API"
3. Copy the curl commands above and convert them to Postman requests
4. Save the collection for future use
5. Use Postman's environment variables to store IDs for easier testing

---

## Troubleshooting

### Connection Errors
- Verify MongoDB Atlas credentials in `.env`
- Check internet connection
- Ensure IP is whitelisted in MongoDB Atlas

### Port Already in Use
```bash
# Kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### No Response from Server
- Check if server is running: `npm run dev`
- Visit `http://localhost:5000/health` to verify

---

## Next Steps

1. Implement JWT authentication
2. Add request validation middleware
3. Set up error logging
4. Create rate limiting
5. Add automated tests
6. Deploy to production

---

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
