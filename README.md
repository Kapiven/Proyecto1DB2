# Restaurant Order & Review Management System

A complete backend API for managing restaurants, users, menu items, orders, and reviews built with Node.js, Express, and MongoDB. Features geolocation-based restaurant discovery, coherent reviews, and optimized data seeding with bulkWrite.

## Project Overview

This system enables:
- **25,359+ restaurants** with geospatial location support
- **165,459 menu items** (6-7 per restaurant, cuisine-appropriate)
- **10,000 users** with geolocation coordinates and unique emails
- **25,027 orders** with geolocation-based restaurant selection
- **3,136 coherent reviews** with cuisine and rating-specific content
- Order creation and status tracking with multi-item support
- Automatic restaurant rating calculations
- Complete order history and analytics

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas) - NYC Restaurant Data
- **ODM:** Mongoose
- **Data Generation:** Faker.js for realistic data
- **Batch Operations:** bulkWrite for optimized performance
- **Additional:** CORS, dotenv

## Key Features

### Geolocation Coherence
- Users automatically matched with nearby restaurants using Haversine formula
- Realistic delivery patterns based on location proximity
- NYC coordinates: Long (-74.05 to -73.87), Lat (40.57 to 40.91)

### Coherent Reviews
- Reviews match cuisine type and rating level
- No generic text - each comment reflects actual food experience
- 9 cuisines: Italian, American, Chinese, Japanese, Mexican, Thai, Indian, Korean, Vietnamese
- 5-star ratings with authentic feedback for each level

### NYC Location Features

This system is specifically optimized for New York City:
- **25,359 restaurants** from MongoDB sample_restaurants collection
- **5 NYC Boroughs:** Manhattan, Brooklyn, Queens, Bronx, Staten Island
- **Geospatial indexing** for location-based proximity searches
- **Street-level addresses** (building, street, zipcode, borough format)
- **User addresses** in NYC geographic bounds with geolocation coordinates

## Installation

1. **Navigate to project directory:**
   ```bash
   cd projectdb
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Configure MongoDB** in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurantes
   PORT=5000
   NODE_ENV=development
   ```

## Project Structure

```
projectdb/
├── models/
│   ├── Restaurante.js    # Restaurant schema with geospatial support
│   ├── Usuario.js        # User schema with validation
│   ├── MenuItem.js       # Menu item schema
│   ├── Orden.js          # Order schema (optimized for sharding)
│   └── Resena.js         # Review schema
│
├── controllers/
│   ├── restauranteController.js
│   ├── usuarioController.js
│   ├── menuItemController.js
│   ├── ordenController.js
│   └── resenaController.js
│
├── routes/
│   ├── restaurantes.js
│   ├── usuarios.js
│   ├── menuItems.js
│   ├── ordenes.js
│   └── resenas.js
│
├── server.js             # Main server file
├── .env                  # Environment variables
├── package.json
└── README.md
```

## Database Collections

### Restaurantes
- Stores restaurant information
- Geospatial indexing for location queries
- Rating system with average calculation
- Soft delete support

### Usuarios
- User accounts with email validation
- Password hashing
- Role-based access (cliente, administrador)
- Spending tracking

### MenuItems
- Menu items linked to restaurants
- Availability status
- GridFS support for images
- Price management

### Ordenes
- Order management with status tracking
- Prevents modification after delivery
- Multi-item support
- Automatic total calculation
- Optimized for sharding

### Reseñas
- Reviews linked to delivered orders
- Star rating (1-5)
- Automatic restaurant rating updates
- Review statistics

## API Endpoints

### Base URL: `http://localhost:5000/api`

**Available Collections:**
- `/restaurantes` - Restaurant management
- `/usuarios` - User management
- `/menu-items` - Menu items
- `/ordenes` - Orders
- `/resenas` - Reviews

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Running the Server

**Development mode** (with auto-reload via nodemon):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### Server Health Check
```bash
curl http://localhost:5000/health
```

## Key Features

### 1. Geospatial Support
Search for restaurants near a location in NYC:
```bash
POST /api/restaurantes/buscar/cercanos
{
  "longitude": -74.0060,
  "latitude": 40.7128,
  "distancia": 5
}
```

### 2. NYC Borough Filtering
Filter restaurants and users by NYC location:
```bash
GET /api/restaurantes/borough/Brooklyn
GET /api/usuarios/borough/Queens
```

### 3. Cuisine Search
Find restaurants by cuisine type:
```bash
GET /api/restaurantes/cuisine/American
```
- Create orders with multiple items
- Automatic price calculation
- Status tracking (PENDIENTE → ENTREGADA)
- Order cancellation (before delivery)
- User spending tracking

### 3. Review System
- Post reviews only for delivered orders
- Automatic rating updates for restaurants
- Review statistics with distribution

### 4. Schema Validation
- Email format validation
- Required field enforcement
- Type checking via Mongoose schemas
- Index creation for performance

### 5. Security Features
- Email uniqueness constraint
- Password hashing
- Data validation at model level
- CORS configuration

## Database Indexes

Automatically created for:
- Restaurant locations (2dsphere)
- User emails (unique)
- Orders by status, user, restaurant
- Reviews by restaurant and user

These indexes optimize query performance and enable complex queries like geospatial searches.

## Connection Information

**MongoDB Connection:** `mongodb+srv://men23975:Mongo151103@cluster0.ygtg1si.mongodb.net/restaurantes`

**Database Name:** `restaurantes`

**Server Port:** `5000`

## Example Usage

### 1. Register a User
```bash
POST /api/usuarios/registro
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "direccion": "Calle 123",
  "telefono": "555-1234"
}
```

### 2. Create a Restaurant
```bash
POST /api/restaurantes
{
  "nombre": "La Pizzería",
  "descripcion": "Pizza italiana",
  "categoria": "Italiana",
  "coordenadas": [-74.0060, 40.7128],
  "direccion": "Calle Principal 123",
  "telefono": "555-0123"
}
```

### 3. Create an Order
```bash
POST /api/ordenes
{
  "usuarioId": "647f1e...",
  "restauranteId": "647f1f...",
  "items": [
    {
      "menuItemId": "647f20...",
      "cantidad": 2
    }
  ],
  "direccionEntrega": "Calle Destino 456"
}
```

## Important Notes

- Orders cannot be modified after being marked as "ENTREGADA"
- Reviews can only be created for delivered orders
- Restaurant ratings are automatically updated when reviews are added/modified
- Images for menu items can be stored using GridFS
- The Orders collection is designed for future sharding

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Next Steps

1. Test all endpoints using Postman or similar tool
2. Implement additional authentication middleware (JWT)
3. Add file upload for restaurant/menu images
4. Implement sharding for Orders collection
5. Create dashboard for analytics
6. Deploy to production (Heroku, AWS, etc.)

## Support

For issues or questions, refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete endpoint details.
