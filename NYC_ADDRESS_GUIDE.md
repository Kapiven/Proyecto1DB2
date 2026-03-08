# NYC Data & Address Format Guide

## Overview

This system uses NYC-specific addresses and location data for restaurants and users. All data is structured to work with real New York City geography and the MongoDB `sample_restaurants` collection.

---

## NYC Boroughs

The system supports 5 NYC boroughs:

1. **Manhattan** 
   - ZIP codes: 10001-10039
   - Central location, financial district

2. **Brooklyn**
   - ZIP codes: 11201-11239
   - Most populous borough

3. **Queens**
   - ZIP codes: 11354-11697
   - Largest borough by area

4. **Bronx**
   - ZIP codes: 10451-10475
   - North of Manhattan

5. **Staten Island**
   - ZIP codes: 10301-10314
   - Southern borough

---

## Address Structure

All addresses use a consistent format with 5 components:

```json
{
  "building": "2780",
  "street": "Stillwell Avenue",
  "zipcode": "11224",
  "borough": "Brooklyn",
  "coord": [-73.9776, 40.5754]
}
```

### Building
- House/building number
- Example: "2780", "456", "1"

### Street
- Street name (include Ave, Street, Road, etc.)
- Example: "Stillwell Avenue", "5th Avenue", "Broadway"

### Zipcode
- 5-digit NYC postal code
- Must match borough area
- Example: "11224" (Brooklyn), "10001" (Manhattan)

### Borough
- Must be: `Manhattan`, `Brooklyn`, `Queens`, `Bronx`, or `Staten Island`
- Case-sensitive

### Coord (Coordinates)
- [longitude, latitude] format
- Longitude: -74.0 to -73.7 for NYC
- Latitude: 40.5 to 40.9 for NYC
- Optional for users, required for restaurants

---

## NYC Zipcode Reference

### Manhattan
- 10001-10039: Full coverage

### Brooklyn
- 11201, 11202: Downtown Brooklyn
- 11211-11212: Williamsburg
- 11215-11218: Park Slope / Prospect Heights
- 11220-11224: Coney Island / Bensonhurst
- Others: 11225-11239

### Queens
- 11354-11356: Flushing
- 11361-11365: Bayside
- 11368-11369: Elmhurst
- 11372-11374: Jackson Heights
- Others: 11375-11697

### Bronx
- 10451-10453: South Bronx
- 10454: Mott Haven
- 10462-10465: Pelham Bay
- Others: 10462-10475

### Staten Island
- 10301-10304: Tompkinsville
- 10305: Stapleton
- 10306: Rosebank
- 10307: Tottenville
- 10308-10314: Various

---

## Sample NYC Coordinates

```javascript
// Manhattan - Times Square area
[-73.9857, 40.7580]

// Brooklyn - Coney Island
[-73.9776, 40.5754]

// Queens - Flushing
[-73.8298, 40.7614]

// Bronx - Pelham Bay
[-73.8287, 40.8448]

// Staten Island - St. George
[-74.0725, 40.6408]
```

---

## Restaurant Data Structure (from sample_restaurants)

```json
{
  "_id": "5eb3d668b31de5d588f4292a",
  "name": "Riviera Caterer",
  "cuisine": "American",
  "restaurant_id": "40356018",
  "address": {
    "building": "2780",
    "street": "Stillwell Avenue",
    "zipcode": "11224",
    "borough": "Brooklyn",
    "coord": [-73.9776, 40.5754]
  },
  "ratingPromedio": 0,
  "totalResenas": 0,
  "fechaCreacion": "2024-01-01T00:00:00.000Z",
  "activo": true
}
```

---

## User Address Structure

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "address": {
    "building": "123",
    "street": "Madison Avenue",
    "zipcode": "10016",
    "borough": "Manhattan"
  },
  "telefono": "555-1234"
}
```

Note: User addresses don't require coordinates, but can include them.

---

## Order Delivery Address

```json
{
  "direccionEntrega": {
    "building": "456",
    "street": "Broadway",
    "zipcode": "10012",
    "borough": "Manhattan"
  }
}
```

---

## API Examples with NYC Data

### Create Restaurant in Brooklyn
```bash
curl -X POST http://localhost:5000/api/restaurantes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Brooklyn Pizza",
    "cuisine": "Italian",
    "restaurant_id": "99999",
    "address": {
      "building": "200",
      "street": "Prince Street",
      "zipcode": "11211",
      "borough": "Brooklyn",
      "coord": [-73.9678, 40.7153]
    }
  }'
```

### Register User in Manhattan
```bash
curl -X POST http://localhost:5000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Maria Garcia",
    "email": "maria@example.com",
    "password": "secure123",
    "address": {
      "building": "500",
      "street": "Park Avenue",
      "zipcode": "10022",
      "borough": "Manhattan"
    },
    "telefono": "555-5678"
  }'
```

### Find Restaurants in Queens
```bash
curl http://localhost:5000/api/restaurantes/borough/Queens
```

### Search Nearby (5 km radius from Manhattan)
```bash
curl -X POST http://localhost:5000/api/restaurantes/buscar/cercanos \
  -H "Content-Type: application/json" \
  -d '{
    "longitude": -73.9857,
    "latitude": 40.7580,
    "distancia": 5
  }'
```

### Create Order with NYC Delivery Address
```bash
curl -X POST http://localhost:5000/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "userId",
    "restauranteId": "restaurantId",
    "items": [{"menuItemId": "itemId", "cantidad": 2}],
    "direccionEntrega": {
      "building": "150",
      "street": "East 42nd Street",
      "zipcode": "10017",
      "borough": "Manhattan"
    }
  }'
```

---

## NYC Restauran Cuisine Types

Based on sample_restaurants data, common cuisines include:
- American
- Italian
- Chinese
- Japanese
- Mexican
- Thai
- Vietnamese
- Indian
- Caribbean
- Mediterranean
- French
- Greek
- Korean
- Turkish
- Spanish

Filter by cuisine:
```bash
GET /api/restaurantes/cuisine/Italian
GET /api/restaurantes/cuisine/Asian
```

---

## Data Validation

### Borough Validation
- Must exactly match: `Manhattan`, `Brooklyn`, `Queens`, `Bronx`, `Staten Island`
- Case-sensitive
- Invalid values will be rejected

### Zipcode Validation
- Must be 5 digits
- Should match selected borough area
- No validation enforced at model level (for flexibility)

### Coordinate Validation
- Longitude: -74.256 to -73.702 (NYC bounds)
- Latitude: 40.4960 to 40.9176 (NYC bounds)
- Format: [longitude, latitude]

---

## Sample Data Summary

**Available in sample_restaurants:**
- 25,359 restaurants
- All 5 NYC boroughs covered
- Real coordinates for each location
- Diverse cuisines
- Complete street-level addresses

**Usage:**
```javascript
// Query existing restaurants
db.sample_restaurants.find({ "address.borough": "Brooklyn" })

// Find by cuisine
db.sample_restaurants.find({ cuisine: "Italian" })

// Geospatial query
db.sample_restaurants.find({
  "address.coord": {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.9857, 40.7580] },
      $maxDistance: 5000
    }
  }
})
```

---

## Best Practices

1. **Use Real NYC Coordinates**
   - Get from Google Maps
   - Use NYC bounding box: (-74.256, 40.496) to (-73.702, 40.918)

2. **Match Zipcode to Borough**
   - Don't mix Manhattan zipcode with Brooklyn borough
   - Refer to Zipcode Reference section

3. **Street Format**
   - Include avenue/street/road designation
   - Examples: "5th Avenue", "Broadway", "Lexington Avenue"

4. **Building Numbers**
   - Can be simple numbers: "123", "456"
   - Can include letters: "123-A", "100B"

5. **Geospatial Queries**
   - Always use proper coordinates
   - Radius in meters (convert km × 1000)
   - Returns restaurants sorted by distance

---

## Integration with sample_restaurants

If importing from MongoDB sample_restaurants:

```javascript
// Migrate sample data
db.restaurantes.insertMany(
  db.sample_restaurants.find({}, {
    name: 1,
    cuisine: 1,
    restaurant_id: 1,
    address: 1
  }).toArray().map(doc => ({
    ...doc,
    ratingPromedio: 0,
    totalResenas: 0,
    fechaCreacion: new Date(),
    activo: true
  }))
)
```

---

## Troubleshooting

### Invalid Borough Error
```
Error: "'SomeBorough' is not a valid enum value"
```
Solution: Use exact spelling - Manhattan, Brooklyn, Queens, Bronx, Staten Island

### Geospatial Query Returns No Results
- Check coordinates are within NYC bounds
- Verify index: `db.restaurantes.getIndexes()`
- Ensure coordinates are [longitude, latitude], not [latitude, longitude]

### Cannot Find Restaurants by Zipcode
- Use borough search instead
- Zip codes are for reference; use borough field for filtering

---

For more information, visit:
- [NYC Wikipedia](https://en.wikipedia.org/wiki/New_York_City)
- [MongoDB Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/)
- [API Documentation](API_DOCUMENTATION.md)
