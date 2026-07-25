# Phase 4: REST API Architectural Standards & Global Protocols

## 1. Unified API Response Envelopes

### A. Success Response Payload (200 OK, 201 Created)

json
{
  "success": true,
  "statusCode": 200,
  "message": "Production record created successfully",
  "data": {
    "_id": "664b1f2e8f9c123456789abc",
    "workerId": "664b1e1a8f9c123456789012",
    "quantityShirts": 120,
    "lossPieces": 2,
    "ratePerShirt": 45.00,
    "totalAmount": 5400.00,
    "productionDate": "2026-07-24T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-07-24T08:05:42.000Z"
  }
}


### B. Paginated Success Response Payload (200 OK)

json
{
  "success": true,
  "statusCode": 200,
  "message": "Workers retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalDocs": 125,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false,
    "timestamp": "2026-07-24T08:05:42.000Z"
  }
}


### C. Standard Error Response Payload (4xx / 5xx)

json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "errors": [
    {
      "field": "quantityShirts",
      "message": "Quantity must be a positive integer greater than 0"
    }
  ],
  "meta": {
    "timestamp": "2026-07-24T08:05:42.000Z",
    "path": "/api/v1/production"
  }
}
