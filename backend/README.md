# TrabaHome Backend

Backend API for TrabaHome - Homeowner and Worker Marketplace

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/trabahome
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running locally or update MONGODB_URI to your MongoDB connection string

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Homeowner Authentication

#### Sign Up
- **POST** `/api/homeowner/signup`
- Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  }
}
```

#### Log In
- **POST** `/api/homeowner/login`
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
- **GET** `/api/homeowner/profile`
- Headers: `Authorization: Bearer <token>`

#### Update Profile (Protected)
- **PUT** `/api/homeowner/profile`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "address": { ... }
}
```

#### Log Out (Protected)
- **POST** `/api/homeowner/logout`
- Headers: `Authorization: Bearer <token>`

## Health Check
- **GET** `/api/health` - Check if server is running
