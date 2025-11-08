# API Endpoints Documentation

## REST API Endpoints

### Authentication
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/logout
GET  /api/auth/me

### Wallet Management
GET    /api/wallets
POST   /api/wallets/create
GET    /api/wallets/:id
POST   /api/wallets/:id/transfer

### Response Format
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
