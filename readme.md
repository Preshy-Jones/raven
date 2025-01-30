# Raven Banking API

A secure banking API for managing user accounts, virtual wallets, and financial transactions integrated with third-party banking services.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## Features

- **User Management**
  - Secure registration with password hashing
  - JWT-based authentication
  - Profile management

- **Wallet System**
  - Virtual wallet balance management
  - Deposit/Withdrawal transactions
  - Real-time balance updates

- **Banking Integration**
  - Generate virtual accounts via Ravenpay
  - Inter-bank transfers
  - Bank listing and account verification
  - Webhook processing for transaction updates

- **Transaction Tracking**
  - Complete transaction history
  - Status tracking (Pending/Completed/Failed)
  - Atomic transaction handling

## Technologies

- **Core**
  - Node.js | Express | TypeScript
  - MySQL | Knex.js (SQL Query Builder)
  - JWT Authentication | Bcrypt Hashing

- **Services**
  - Axios for HTTP requests
  - Ravenpay Banking Integration

- **Testing**
  - Jest | Supertest
  - Database transaction rollbacks

## Getting Started

### Prerequisites

- Node.js 18.x
- MySQL 8.0+
- Ravenpay API Key

### Installation

1. Clone repository:
```bash
git clone https://github.com/Preshy-Jones/raven.git
cd raven
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your database and Ravenpay API credentials.

5. Run database migrations:
```bash
npx knex migrate:latest
```

6. Start the server:
```bash
npm run dev
```

## API Documentation

The API documentation is available at [https://documenter.getpostman.com/view/11119609/2sAYX2N4Zr].


<!-- Key Endpoints
Authentication -->

## Key Endpoints

### Authentication

- **POST /api/user/signup** - Register a new user account

- **POST /api/auth/login** - Authenticate user and generate JWT token

### User Management

- **GET /api/user/me** - Get user profile

### Transaction Management and Wallet System
<!-- 
POST /api/transactions/transfers
GET /api/transactions/wallet-balance
POST /api/transactions/generate-collection-account -->

- **POST /api/transactions/generate-collection-account** - Generate a virtual account for receiving funds

- **POST /api/transaction/raven-webhook** - Process transaction webhook from Ravenpay, to update wallet balance when a successful deposit is made.

- **POST /api/transaction/transfers** - Transfer funds between wallets

- **GET /api/transaction/wallet-balance** - Get wallet balance


