# MongoDB Collection Schema Validation Guide

## Overview

This document describes the MongoDB collections created for the Restaurant Order & Review System.

---

## Collection: `restaurantes`

**Purpose:** Store restaurant information with geospatial support (compatible with sample_restaurants)

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  cuisine: String (required),
  restaurant_id: String (required, unique),
  address: {
    building: String (required),
    street: String (required),
    zipcode: String (required),
    borough: String (enum: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], required),
    coord: [Number, Number] // [longitude, latitude]
  },
  ratingPromedio: Number (min: 0, max: 5, default: 0),
  totalResenas: Number (min: 0, default: 0),
  fechaCreacion: Date (default: Date.now),
  activo: Boolean (default: true)
}
```

**Indexes:**
- `address.coord: "2dsphere"` - Geospatial queries
- `address.borough: 1` - Borough-based queries

**Features:**
- GeoJSON Point for location-based searches
- NYC-only boroughs: Manhattan, Brooklyn, Queens, Bronx, Staten Island
- Cuisine categorization
- Average rating calculation
- Soft delete with `activo` flag
- Compatible with NYC sample_restaurants data
- Ready for location-based analytics

---

## Collection: `usuarios`

**Purpose:** Store user account information (NYC-based)

**Schema:**
```javascript
{
  _id: ObjectId,
  nombre: String (required),
  email: String (required, unique, lowercase),
  passwordHash: String (required),
  address: {
    building: String (required),
    street: String (required),
    zipcode: String (required),
    borough: String (enum: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], required),
    coord: [Number, Number] // [longitude, latitude] (optional)
  },
  telefono: String (required),
  fechaRegistro: Date (default: Date.now),
  rol: String (enum: ["cliente", "administrador"], default: "cliente"),
  totalGastado: Number (min: 0, default: 0)
}
```

**Indexes:**
- `email: 1 (unique)` - Ensure email uniqueness

**Validation:**
- Email format via regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
- Non-negative totalGastado
- Borough must be NYC location

**Security:**
- Password stored as hash (SHA-256, use bcrypt in production)
- Sensitive fields excluded from API responses
- Users restricted to NYC addresses

---

## Collection: `menuitems`

**Purpose:** Store menu items for restaurants

**Schema:**
```javascript
{
  _id: ObjectId,
  restauranteId: ObjectId (ref: "Restaurante", required),
  nombre: String (required),
  descripcion: String (required),
  precio: Number (required, min: 0),
  categoria: String (required),
  disponible: Boolean (default: true),
  imagenId: ObjectId (ref: "fs.files", GridFS reference),
  fechaCreacion: Date (default: Date.now)
}
```

**Indexes:**
- `restauranteId: 1` - Fast queries by restaurant

**Features:**
- Reference to GridFS for image storage
- Availability flag for menu management
- Categorization for grouping items
- Menu item history via creation date

---

## Collection: `ordenes`

**Purpose:** Store customer orders (optimized for sharding, NYC-based)

**Schema:**
```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId (ref: "Usuario", required),
  restauranteId: ObjectId (ref: "Restaurante", required),
  items: [
    {
      menuItemId: ObjectId (ref: "MenuItem", required),
      nombre: String (required),
      precioUnitario: Number (required, min: 0),
      cantidad: Number (required, min: 1),
      subtotal: Number (required, min: 0)
    }
  ],
  total: Number (required, min: 0),
  estado: String (enum: ["PENDIENTE", "CONFIRMADA", "EN_PREPARACION", 
                         "LISTA", "ENTREGADA", "CANCELADA"], default: "PENDIENTE"),
  fechaOrden: Date (default: Date.now),
  fechaEntrega: Date,
  direccionEntrega: {
    building: String (required),
    street: String (required),
    zipcode: String (required),
    borough: String (enum: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], required)
  },
  comentarios: String
}
```

**Indexes:**
- `usuarioId: 1` - User order queries
- `restauranteId: 1` - Restaurant order queries
- `estado: 1` - Status-based queries
- `fechaOrden: -1` - Recent orders first

**Features:**
- Denormalized item details for query efficiency
- Automatic total calculation
- Status workflow: PENDIENTE → ENTREGADA (or CANCELADA)
- Prevents modification after ENTREGADA
- Supports future sharding
- NYC street addresses for delivery

**Business Rules:**
- Orders cannot be modified after delivery
- Total is calculated from items
- User spending is updated when order is created
- Delivery address must be in NYC

---

## Collection: `resenas`

**Purpose:** Store customer reviews and ratings

**Schema:**
```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId (ref: "Usuario", required),
  restauranteId: ObjectId (ref: "Restaurante", required),
  ordenId: ObjectId (ref: "Orden", required),
  rating: Number (required, min: 1, max: 5),
  comentario: String (required),
  fecha: Date (default: Date.now)
}
```

**Indexes:**
- `restauranteId: 1` - Restaurant reviews
- `usuarioId: 1` - User review history
- `ordenId: 1` - Review lookup by order

**Features:**
- Star rating 1-5
- Linked to specific orders
- Automatic restaurant rating updates
- Review statistics calculation

**Business Rules:**
- Reviews can only be created for ENTREGADA orders
- Restaurant average rating auto-updates
- Total review count auto-updates

---

## Database Initialization

When the server starts, it automatically:

1. **Creates Indexes**
   - Geospatial index for restaurant locations (address.coord)
   - Borough index for restaurant filtering
   - Unique constraint on user email
   - Query optimization indexes for orders and reviews

2. **Sets Up Validation**
   - Type checking via Mongoose schemas
   - Email format validation
   - Required field enforcement
   - Enum validation for NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
   - Enum validation for status fields

3. **Enables Relationships**
   - Document references via ObjectId
   - Population of related data with `.populate()`
   - Address-based geographic filtering

---

## Data Relationships

```
Usuarios (1) ←-→ (M) Ordenes
  |
  ├─ (1) ←-→ (M) Resenas
  |
  └─ Can create orders and reviews


Restaurantes (1) ←-→ (M) MenuItems
  |
  ├─ (1) ←-→ (M) Ordenes
  |
  ├─ (1) ←-→ (M) Resenas
  |
  └─ Updated rating from Resenas


Ordenes (1) ←-→ (M) Items
  |
  └─ Contains MenuItems references


Resenas:
  - Links Usuario → Restaurante → Orden
  - Updates Restaurante rating
```

---

## GridFS Configuration (Images)

The system is ready to support image storage via GridFS:

```javascript
// Future implementation
const upload = multer({ storage: gridFsStorage });

app.post('/upload-image', upload.single('file'), (req, res) => {
  // Save gridFS file ID to MenuItem.imagenId
});
```

---

## Sharding Strategy

The `ordenes` collection is optimized for horizontal scaling:

**Shard Key:** `restauranteId` + `fechaOrden`

Rationale:
- Expected highest growth
- Distribute by restaurant (load balancing)
- Time-based partitioning enables data archiving

---

## Backup Strategy

Recommended MongoDB Atlas Backup:
- Daily automated backups
- Point-in-time restore
- On-demand backup snapshots

---

## Monitoring Recommendations

Monitor these metrics:
- Collection sizes and index usage
- Query performance
- Connection pool utilization
- Replication lag (if applicable)

---

## Migration Notes

To migrate to a new MongoDB instance:

1. Export collections:
   ```bash
   mongoexport --uri="mongodb+srv://old-connection" --collection=restaurantes --out=restaurantes.json
   ```

2. Import to new instance:
   ```bash
   mongoimport --uri="mongodb+srv://new-connection" --collection=restaurantes --file=restaurantes.json
   ```

---

## Production Considerations

1. **Security**
   - Enable password hashing with bcrypt
   - Implement JWT authentication
   - Use IP whitelist in MongoDB Atlas

2. **Performance**
   - Monitor slow queries
   - Optimize indexes based on usage
   - Consider read replicas for scale

3. **Data Integrity**
   - Enable transactions for critical operations
   - Implement audit logging
   - Regular backup testing

4. **Scalability**
   - Implement sharding when ordenes > 100M documents
   - Use connection pooling
   - Consider caching layer (Redis)
