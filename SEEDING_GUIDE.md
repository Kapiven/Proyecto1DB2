# Database Seeding Guide

This guide explains how to populate your MongoDB database with comprehensive, production-ready data using the Faker library and optimized bulkWrite operations.

---

## Overview

The seeding system includes three separate scripts for different data layers:

1. **seed.js** - Seed restaurants and base menu items (25,359 restaurants)
2. **seed-menu-items.js** - Create menu items for ALL restaurants (165,459 menu items total)
3. **seed-users-orders-reviews.js** - Generate realistic users, orders, and coherent reviews (10,000 users, 25,027 orders, 3,136 reviews)

---

## Prerequisites

- ✅ Faker library installed: `npm install @faker-js/faker`
- ✅ MongoDB connection configured in `.env`
- ✅ Node.js models created in `models/` folder
- ✅ MongoDB connection string ready

---

## Running the Seeding Scripts

### 1️⃣ Seed Restaurants & Base Menu Items

Seeds restaurants from `sample_restaurants` collection:

```bash
npm run seed
```

**What it does:**
- Syncs 25,359 restaurants from MongoDB sample_restaurants
- Creates initial menu structure
- Sets up restaurant geospatial indexing
- Approximately 5-10 minutes

**Output:**
```
✓ Found 25359 restaurants
✓ Synced X restaurants
✓ Created menu items
```

---

### 2️⃣ Seed All Menu Items (bulkWrite)

Generates 5-8 cuisine-appropriate menu items for EACH restaurant:

```bash
npm run seed:menu
```

**What it does:**
- Processes 25,359 restaurants in batches of 100
- Generates 165,459 menu items total (6.52 average per restaurant)
- Uses **bulkWrite** for optimal MongoDB performance
- Cuisine-appropriate items (12 cuisine types)
- Price variations (±15%) for realism
- Approximately 8-12 minutes

**Example output:**
```
Processing restaurants 1 to 100...
  ✓ Inserted 640 menu items (640 total)
Processing restaurants 101 to 200...
  ✓ Inserted 627 menu items (1267 total)
...
✓ Total Menu Items Created: 165459
✓ Average Items per Restaurant: 6.52
```

**Cuisine Templates (12 types):**
- Italian, American, Chinese, Japanese, Mexican, Thai, Indian, Korean, Vietnamese, French, Spanish, Irish

---

### 3️⃣ Seed Users, Orders & Reviews (bulkWrite + Geolocation)

Generates realistic users with geolocation-based orders and coherent reviews:

```bash
npm run seed:users
```

**What it does:**
- Creates 10,000 unique users with NYC coordinates
- Generates 25,027 orders (2.50 average per user)
- Creates 3,136 coherent reviews (0.31 average per user)
- **Geolocation matching:** Users order from nearest restaurants (Haversine formula)
- **Coherent reviews:** Comments match cuisine type + rating level
- Uses **bulkWrite** for 1,000-item chunks
- Only generates reviews for delivered orders (realistic behavior)
- Approximately 15-20 minutes

**Key Features:**

✨ **Geolocation Coherence:**
- Each user has NYC coordinates (-74.05 to -73.87, 40.57 to 40.91)
- Orders from 10 nearest restaurants (bias towards closest)
- No random geographically-illogical orders

✨ **Coherent Reviews:**
- Reviews match 9 cuisine types AND rating level
- 5-star Italian: "Outstanding! Chef knows what they're doing!"
- 2-star Italian: "Disappointing. Sauce was too salty."
- No generic/random text - authentic food critiques
- Only for ENTREGADA (delivered) orders

**Example output:**
```
Inserting usuarios using bulkWrite...
  ✓ Inserted 1000 usuarios (1000/10000)
  ✓ Inserted 1000 usuarios (2000/10000)
...
Inserting ordenes using bulkWrite (25027 operations)...
  ✓ Inserted 1000 ordenes (1000/25027)
...
Inserting reseñas using bulkWrite (3136 operations)...
  ✓ Inserted 1000 reseñas (1000/3136)

========== SEEDING COMPLETE ==========
✓ Total Usuarios: 10000
✓ Total Ordenes: 25027
✓ Total Reseñas: 3136
✓ Average orders per user: 2.50
✓ Average reviews per user: 0.31
```

---

## Complete Workflow

### Fresh Database Setup

```bash
# 1. Seed restaurants and base structure
npm run seed

# 2. Create menu items for all restaurants
npm run seed:menu

# 3. Generate users with orders and reviews
npm run seed:users
```

**Total time:** ~25-35 minutes for complete population

**Final Database State:**
- ✓ 25,359 restaurants
- ✓ 165,459 menu items
- ✓ 10,000 users
- ✓ 25,027 orders
- ✓ 3,136 reviews

---

## Clearing Data

### Clear Only Users, Orders, Reviews (Keep Restaurants & Menu Items)

```bash
npm run seed:clear
```

**What it deletes:**
- ❌ All usuarios (users)
- ❌ All ordenes (orders)
- ❌ All reseñas (reviews)

**What it KEEPS:**
- ✓ restaurantes (restaurants) - 25,359
- ✓ menuItems (items) - 165,459

This allows you to regenerate just the user layer while keeping stable restaurant data.

---

## BulkWrite Implementation

All scripts use **bulkWrite** for optimal performance:

### Users Generation
```javascript
const result = await Usuario.collection.bulkWrite(chunk);
// Inserted in 10 chunks of 1,000 each
```

### Orders Generation
```javascript
const result = await Orden.collection.bulkWrite(chunk);
// Inserted in 26 chunks of 1,000 each (25,027 total)
```

### Reviews Generation
```javascript
const result = await Resena.collection.bulkWrite(chunk);
// Inserted in 4 chunks of 1,000 each (3,136 total)
```

### Menu Items Generation
```javascript
const result = await MenuItem.collection.bulkWrite(chunk);
// Processed in 255 restaurant batches × 1,000-item chunks
// Total: 165 chunks across all restaurants
```

**Benefits:**
- ⚡ Single network round-trip per batch
- 📊 Significant performance improvement vs individual inserts
- ✅ Atomic batch operations
- 🎯 Progress tracking with detailed output

---

## Data Coherence

### Geographic Coherence
- Users: NYC coordinates with specific borough assignments
- Restaurants: 25,359 NYC locations with accurate coordinates
- Orders: Users order from geographically nearby restaurants
- **Distance calculation:** Haversine formula (great-circle distance)

### Review Coherence  
- Each review reflects the actual cuisine type and restaurant
- Rating matches comment tone:
  - ⭐⭐⭐⭐⭐ Passionate praise with specific compliments
  - ⭐⭐ Constructive criticism with specific issues
- No two reviews are identical
- Only generated for successfully delivered orders

### Menu Item Coherence
- Items match restaurant cuisine type
- Prices scaled realistically (±15% variation)
- Item availability at 90% (realistic stock management)
- Creation dates distributed across past year

---

## Environment Variables

Required in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurantes
PORT=5000
NODE_ENV=development
```

---

## Troubleshooting

### Script fails with "No restaurants found"
```
❌ npm run seed:menu
Error: No restaurants found!
```
**Solution:** Run `npm run seed` first to populate restaurants

### E11000 duplicate key error on emails
```
❌ MongoBulkWriteError: E11000 duplicate key error collection
```
**Solution:** Run `npm run seed:clear` to clear users, then run `npm run seed:users`

### Memory issues on large batches
**Solution:** Reduce CHUNK_SIZE in the script (default: 1000)

### Connection timeout
```
❌ Error: connect ECONNREFUSED
```
**Solution:** Check `.env` MONGODB_URI and network connectivity

✓ Connected to MongoDB

📦 Fetching restaurants from sample_restaurants...
✓ Found 25359 restaurants

📝 Syncing restaurants to Restaurante collection...
✓ Synced 1234 restaurants (11125 already existed)

🍽️  Creating menu items for restaurants...
  ⏳ Processed 100/25359 restaurants...
  ⏳ Processed 200/25359 restaurants...
✓ Created 12340 menu items (13019 restaurants already had items)

👥 Creating sample users...
✓ Created 5 sample users

📦 Creating sample orders...
✓ Created 10 sample orders with reviews

✅ Database seeding completed successfully!
```

---

## Sample Data Generated

### Menu Items by Cuisine

The script generates menu items based on restaurant cuisine. Each cuisine has 8 template items:

**Italian Cuisine:**
- Pasta Carbonara ($14.99)
- Spaghetti Bolognese ($13.99)
- Lasagna ($15.99)
- And 5 more items

**American Cuisine:**
- Classic Burger ($11.99)
- New York Style Pizza ($10.99)
- Hot Dog ($5.99)
- And 5 more items

**Additional Cuisines:**
- Chinese, Japanese, Mexican, Thai, Indian, Korean, Vietnamese, French, Spanish
- Default templates for unrecognized cuisines

Each restaurant gets 5-10 randomly selected items from its cuisine template.

### Sample Users

Five test users created (if they don't already exist):

```javascript
[
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    borough: "Manhattan"
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    borough: "Manhattan"
  },
  {
    name: "Carol Davis",
    email: "carol@example.com",
    borough: "Brooklyn"
  },
  {
    name: "David Wilson",
    email: "david@example.com",
    borough: "Queens"
  },
  {
    name: "Emma Brown",
    email: "emma@example.com",
    borough: "Bronx"
  }
]
```

All use password: `password123` (for testing only)

### Sample Orders

10 random orders created with:
- Random user from sample users
- Random restaurant from ~50 restaurants
- Random menu items (1-3 items per order)
- Status: ENTREGADA or CONFIRMADA
- Reviews created for delivered orders

---

## FAQ & Troubleshooting

### Q: Can I run the seed script multiple times?

**A:** Yes! The script checks for existing data and only creates non-duplicates:
- Restaurants are checked by `restaurant_id`
- Menu items are checked by restaurant
- Sample users are checked by email

Running again won't create duplicates.

### Q: How long does seeding take?

**A:** Depends on database size:
- First run: 5-15 minutes (creating 12,000+ menu items)
- Subsequent runs: 2-5 minutes (checking duplicates)

### Q: Why are some restaurants missing menu items?

**A:** They already exist. The script checks `restauranteId` and skips if items exist.

To regenerate, use the clear script first.

### Q: Can I customize the menu items?

**A:** Yes! Edit `MENU_TEMPLATES` in `seed.js`:

```javascript
const MENU_TEMPLATES = {
  'Italian': [
    { name: 'Your Item', description: 'Your description', price: 12.99 },
    // ... more items
  ]
};
```

### Q: What if connection fails?

**A:** Check:
1. MongoDB Atlas is online
2. `.env` connection string is correct
3. IP is whitelisted
4. Network connection is active

### Q: Can I seed only menu items?

**A:** Modify `seed.js` to comment out unwanted sections:

```javascript
// Comment out restaurant sync
// for (const sampleRestaurant of restaurants) { ... }

// Keep only menu items
// Create menu items for restaurants...
```

### Q: How do I clear all seeded data?

**A:** Use the clear script:

```bash
npm run seed:clear
```

This deletes:
- All menu items
- Sample users (alice@, bob@, carol@, etc.)
- All orders
- All reviews

---

## Script Details

### seed.js

**Main seeding script with:**
- Restaurant synchronization from `sample_restaurants`
- Menu item generation (5-10 per restaurant)
- Cuisine-based menu templates
- Sample user creation
- Order and review generation

**Key Features:**
- Duplicate prevention
- Progress tracking
- Error handling
- Transaction safety

### clear-seed.js

**Data cleanup script that:**
- Deletes all menu items
- Removes sample users by email
- Clears all orders and reviews

**Safe deletion:**
- Only deletes sample user emails
- No data loss for production users

---

## Menu Item Generation Logic

```javascript
for each restaurant in database:
  if restaurant has no menu items:
    get cuisine type (e.g., "Italian")
    get template for cuisine or use default
    randomly select 5-10 items from template
    for each selected item:
      create MenuItem with slight price variation
      set cuisine-appropriate category
      set availability (95% true)
```

### Price Variation

Prices vary slightly from templates:
- Base price ± random offset
- Offset range: -$2 to +$2 in $0.99 increments
- Example: $14.99 template → $12.99 to $16.99

### Categories

Menu items randomly assigned:
- Appetizer
- Main Course
- Dessert
- Beverage
- Side Dish

### Availability

- 95% of items marked as available
- 5% marked as unavailable for realism

---

## Database Schema Changes

### MenuItems Collection

```javascript
{
  _id: ObjectId,
  restauranteId: ObjectId(Restaurant),
  nombre: String,                    // Item name
  descripcion: String,               // Item description
  precio: Number,                    // Generated price
  categoria: String,                 // Generated category
  disponible: Boolean,               // 95% true
  fechaCreacion: Date
}
```

### Usuarios Collection

```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String,                     // Sample user emails
  passwordHash: String,
  address: AddressObject,            // NYC addresses
  telefono: String,
  fechaRegistro: Date,
  rol: "cliente",
  totalGastado: Number
}
```

### Ordenes Collection

```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId(User),
  restauranteId: ObjectId(Restaurant),
  items: Array,                      // Generated items
  total: Number,                     // Calculated
  estado: String,                    // ENTREGADA or CONFIRMADA
  fechaOrden: Date,
  direccionEntrega: AddressObject,    // User address
  comentarios: String
}
```

---

## Performance Metrics

After full seeding:

```
Total Data:
- Restaurants: ~25,359
- Menu Items: ~250,000+ (10 avg per restaurant)
- Sample Users: 5
- Sample Orders: 10
- Sample Reviews: 10

Indexes Created:
- address.coord (2dsphere) - Geospatial
- address.borough - Borough queries
- email (unique) - User lookup
- restauranteId - Menu queries
- usuarioId, restauranteId, estado - Order queries
```

---

## Verification

After seeding, verify data:

### Check Restaurant Count
```bash
curl http://localhost:5000/api/restaurantes | head -50
```

### Check Menu Items by Restaurant
```bash
# Replace {restaurantId} with actual ID
curl http://localhost:5000/api/menu-items/restaurante/{restaurantId}
```

### Check Sample Users
```bash
curl http://localhost:5000/api/usuarios
```

### Check Orders
```bash
# Get user orders
curl http://localhost:5000/api/ordenes/usuario/{userId}
```

---

## Next Steps

1. **Verify Data**: Check collections in Mongo Compass
2. **Test APIs**: Use endpoints to query seeded data
3. **Load Testing**: Use seeded data for performance testing
4. **Custom Menus**: Replace templates with your menu items
5. **Production Data**: Import real restaurant data

---

## Tips & Best Practices

1. **Run on Staging First**
   - Test seeding on staging before production
   - Verify results in Mongo Compass

2. **Backup Before Clearing**
   - Save important data before running `npm run seed:clear`
   - Back up to separate database

3. **Monitor Progress**
   - Watch terminal output for progress
   - Check MongoDB logs for errors

4. **Scale Gradually**
   - Start with 100 restaurants
   - Increase as needed
   - Monitor performance

5. **Customize Data**
   - Modify templates for your cuisine types
   - Add your own menu items
   - Adjust prices for your market

---

## Troubleshooting Commands

```bash
# Check if seed script exists
ls -la seed.js

# Verify faker installation
npm list @faker-js/faker

# Check all npm scripts
npm run

# Test connection without seeding
node -e "require('dotenv').config(); const m = require('mongoose'); m.connect(process.env.MONGODB_URI).then(() => { console.log('Connected'); process.exit(0); });"

# Check menu items in database
mongo -u username -p password --authenticationDatabase admin --eval "db.menuitems.count()"
```

---

## Support

For issues, check:
1. [Faker Documentation](https://fakerjs.dev/)
2. [MongoDB Documentation](https://docs.mongodb.com/)
3. [Mongoose Documentation](https://mongoosejs.com/)
4. [NYC Address Guide](NYC_ADDRESS_GUIDE.md)

---

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
