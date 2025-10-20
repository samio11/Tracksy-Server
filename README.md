# 🚗 Tracksy Server

<div align="center">

![Tracksy Logo](https://i.ibb.co/XZwMnkH1/tracksy.jpg)

**A modern ride-sharing platform backend built with Node.js, Express, TypeScript & MongoDB**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)

[🚀 Live API](https://tracksy-server.vercel.app) • [📖 Documentation](#-api-documentation) • [⚡ Quick Start](#-quick-start)

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role registration** (User, Driver, Admin) with email verification
- **Secure login** with JWT tokens & bcrypt password hashing
- **Password recovery** via OTP (Redis-cached, 2-min expiration)
- **Email verification** with automated welcome emails

### 🚕 Ride Management
- **Smart ride creation** with auto distance/duration/fare calculation
- **Promo code system** offering 15% discount with OTP validation
- **Complete ride lifecycle**: Request → Accept → Start → Complete → Cancel
- **Real-time status tracking** with detailed ride history
- **Advanced filtering** with search, sort, pagination & field selection

### 💳 Payment Integration
- **SSLCommerz payment gateway** with secure transaction processing
- **Automatic payment initiation** on ride completion
- **Invoice generation** with unique transaction IDs
- **Payment status tracking** (pending, completed, failed)

### 👥 User Management
- **Role-based access** (User, Driver, Admin)
- **Driver profiles** with vehicle information
- **Vehicle management** (model, capacity, images, type)
- **Transaction-safe** driver registration with MongoDB sessions

### 🎫 Promotional System
- **Admin discount OTP** with 1-hour validity
- **15% discount** on ride fares
- **Redis-based OTP storage** for fast validation

### 📧 Communication
- **Automated email notifications** with professional HTML templates
- **Welcome emails** with verification links
- **OTP emails** for password reset & discounts
- **EJS templating** for beautiful, responsive emails

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | Node.js, TypeScript, Express 5.x, MongoDB 8.x |
| **Authentication** | JWT, Bcrypt, Passport (Google OAuth) |
| **Payment** | SSLCommerz |
| **Caching** | Redis 5.x |
| **Storage** | Cloudinary (images), Multer (uploads) |
| **Email** | Nodemailer, EJS |
| **Validation** | Zod |
| **Database** | Mongoose ODM |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis Server
- Cloudinary Account
- SSLCommerz Merchant Account

### Installation

```bash
# Clone repository
git clone https://github.com/samio11/Tracksy-Server.git
cd Tracksy-Server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start Redis
redis-server

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 🔐 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/tracksy

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT=10

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

# URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=https://tracksy-server.onrender.com
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://tracksy-server.onrender.com/api/v1
```

### 🔑 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/user` | Register as user |
| POST | `/auth/register/driver` | Register as driver with vehicle |
| POST | `/auth/register/admin` | Register as admin |
| POST | `/auth/login` | Login with email & password |
| GET | `/auth/verify/:email` | Verify email address |
| POST | `/auth/forgot-password` | Send password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |

#### Example: Register User
```json
POST /auth/register/user
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePass123",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Example: Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePass123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "name": "John Doe", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 🚕 Ride Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rides/create` | Create new ride |
| POST | `/rides/discount-otp` | Send discount OTP (Admin) |
| PUT | `/rides/:id/accept` | Accept ride (Driver) |
| PUT | `/rides/:id/start` | Start ride (Driver) |
| PUT | `/rides/:id/complete` | Complete ride & initiate payment (Driver) |
| PUT | `/rides/:id/cancel` | Cancel ride (User) |
| GET | `/rides` | Get all rides (with filters) |
| GET | `/rides/:id` | Get single ride details |

#### Example: Create Ride
```json
POST /rides/create
{
  "rider": "60d5ec49f8d2e82d8c8b4567",
  "startRide": {
    "type": "Point",
    "coordinates": [90.4125, 23.8103],
    "address": "Dhaka, Bangladesh"
  },
  "endRide": {
    "type": "Point",
    "coordinates": [90.4200, 23.8200],
    "address": "Gulshan, Dhaka"
  },
  "promoCode": "123456"
}

Response:
{
  "success": true,
  "data": {
    "_id": "60d5ec49f8d2e82d8c8b4571",
    "distance": "5.2 km",
    "duration": "15 mins",
    "fare": 85.50,
    "rideStatus": "requested"
  }
}
```

#### Example: Complete Ride
```json
PUT /rides/:rideId/complete
{
  "driverId": "60d5ec49f8d2e82d8c8b4568"
}

Response:
{
  "success": true,
  "data": {
    "payment_url": "https://sandbox.sslcommerz.com/...",
    "payment_data": {
      "amount": 85.50,
      "transactionId": "TXN-1234567890",
      "status": "pending"
    }
  }
}
```

#### Query Parameters for GET /rides
```
?rideStatus=completed     # Filter by status
&search=john              # Search by rider name/email
&sort=-createdAt          # Sort by field (- for descending)
&fields=rider,fare        # Select specific fields
&page=1&limit=10          # Pagination
```

---

## 🗄 Database Models

### User Schema
```typescript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String,
  role: 'user' | 'driver' | 'admin',
  avatar: String,
  isVerified: Boolean,
  driverProfile: ObjectId (ref: Driver)
}
```

### Driver Schema
```typescript
{
  user: ObjectId (ref: User),
  vehicle: ObjectId (ref: Vehicle),
  licenseNumber: String,
  status: 'available' | 'busy' | 'offline',
  location: { type: 'Point', coordinates: [lon, lat] },
  rating: Number,
  acceptedRide: Number,
  income: Number
}
```

### Ride Schema
```typescript
{
  rider: ObjectId (ref: User),
  driver: ObjectId (ref: Driver),
  startRide: { type: 'Point', coordinates: [lon, lat], address: String },
  endRide: { type: 'Point', coordinates: [lon, lat], address: String },
  distance: String,
  duration: String,
  fare: Number,
  rideStatus: 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled',
  rideHistory: [{ status: String, time: Date }],
  promoCode: String
}
```

### Payment Schema
```typescript
{
  ride: ObjectId (ref: Ride),
  user: ObjectId (ref: User),
  amount: Number,
  status: 'pending' | 'completed' | 'failed',
  transactionId: String (unique),
  invoiceUrl: String
}
```

---

## 🔄 Ride Lifecycle

```
┌─────────────┐
│  REQUESTED  │ ◄── User creates ride
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ACCEPTED   │ ◄── Driver accepts
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   STARTED   │ ◄── Driver starts ride
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  COMPLETED  │ ◄── Driver completes → Payment initiated
└─────────────┘

       OR

┌─────────────┐
│  CANCELLED  │ ◄── User cancels (only if requested)
└─────────────┘
```

---

## 💡 Key Features Explained

### 🎟️ Promo Code System
1. Admin sends discount OTP to user's email
2. OTP stored in Redis: `discout_user_{email}` (1-hour expiration)
3. User enters OTP during ride creation
4. System validates OTP and applies 15% discount
5. OTP is single-use and expires after 1 hour

### 🔒 Password Reset Flow
1. User requests password reset
2. 6-digit OTP generated and sent via email
3. OTP stored in Redis: `otp_{email}` (2-minute expiration)
4. User submits email, OTP, and new password
5. System validates OTP and updates password
6. Password is hashed with bcrypt before saving

### 🚙 Driver Registration
Transaction-based registration ensures data consistency:
1. Creates User document
2. Creates Vehicle document
3. Creates Driver document
4. Links all three together
5. Sends verification email
6. **Rolls back entire process if any step fails**

### 💳 Payment Flow
1. Driver completes ride
2. System generates unique transaction ID
3. Creates payment record with "pending" status
4. Initiates SSLCommerz payment gateway
5. User redirected to payment page
6. Payment status updated on success/failure
7. All operations wrapped in MongoDB transaction

---

## 📧 Email Templates

The system sends automated emails for:

| Template | Trigger | Content |
|----------|---------|---------|
| **Welcome Email** | User/Driver/Admin registration | Verification link, profile details |
| **Password Reset OTP** | Forgot password request | 6-digit OTP, 2-min validity |
| **Discount OTP** | Admin sends promo | 6-digit code, 15% discount, 1-hour validity |

All emails use professional EJS templates with:
- Responsive design
- Brand logo
- Clear call-to-action buttons
- Mobile-friendly layout

---

## 🏗 System Architecture

```
┌──────────────┐
│   Client     │
│  (Web/App)   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│          Express API Server          │
│  ┌────────┬────────┬──────────────┐  │
│  │  Auth  │  Ride  │   Payment    │  │
│  └────────┴────────┴──────────────┘  │
└──────┬───────────────┬───────────────┘
       │               │
   ┌───┴───┐       ┌───┴────┐
   ▼       ▼       ▼        ▼
┌──────┐ ┌─────┐ ┌──────┐ ┌────────────┐
│ Mongo│ │Redis│ │Cloud-│ │SSLCommerz  │
│  DB  │ │Cache│ │ inary│ │  Gateway   │
└──────┘ └─────┘ └──────┘ └────────────┘
```

---

## 🔒 Security Features

- **Password Hashing**: Bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based sessions
- **OTP Expiration**: Time-limited OTPs in Redis
- **Transaction Safety**: MongoDB sessions for critical operations
- **Email Verification**: Mandatory account verification
- **Role-Based Access**: Separate permissions for users/drivers/admins
- **Input Validation**: Zod schema validation
- **Error Handling**: Centralized error management

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start with hot reload

# Production
npm run build        # Compile TypeScript
npm start           # Run compiled code

# Testing
npm test            # Run tests (if configured)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@samio11](https://github.com/samio11)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the powerful database
- SSLCommerz for payment gateway
- Cloudinary for image hosting
- All open-source contributors

---

<div align="center">

**Made with ❤️ using Node.js & TypeScript**

⭐ Star this repo if you find it helpful!

</div>
