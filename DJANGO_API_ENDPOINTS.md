# BOL-TAS Django API Endpoints

## Overview

This document specifies all REST API endpoints for the BOL-TAS Django backend. Endpoints are organized by functionality and include HTTP methods, authentication requirements, request/response formats, and status codes.

## Authentication Endpoints

### JWT Token Management

#### POST `/api/auth/token/`
Obtain JWT access and refresh tokens.

**Authentication:** None required
**Permissions:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Responses:**
- 401 Unauthorized: Invalid credentials

#### POST `/api/auth/token/refresh/`
Refresh JWT access token.

**Authentication:** None required
**Permissions:** None

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### User Registration & Profile

#### POST `/api/auth/register/`
Register a new user account.

**Authentication:** None required
**Permissions:** None

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "full_name": "John Doe",
  "password": "securepassword123",
  "role": "teen"
}
```

**Response (201 Created):**
```json
{
  "id": 123,
  "email": "newuser@example.com",
  "full_name": "John Doe",
  "role": "teen",
  "personal_code": "12345",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### GET `/api/auth/profile/`
Get current user profile.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "full_name": "John Doe",
  "preferred_name": "John",
  "role": "teen",
  "personal_code": "12345",
  "profile_photo_url": "https://storage.example.com/photos/user_123.jpg",
  "attendance_streak": 5,
  "total_check_ins": 45
}
```

#### PUT `/api/auth/profile/`
Update current user profile.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Request Body:**
```json
{
  "preferred_name": "Johnny",
  "phone_number": "(555) 123-4567",
  "ministry": "youth_choir"
}
```

#### POST `/api/auth/change-password/`
Change user password.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Request Body:**
```json
{
  "old_password": "currentpassword",
  "new_password": "newsecurepassword123"
}
```

## User Management Endpoints

### User CRUD Operations

#### GET `/api/users/`
List all users (admin only).

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Query Parameters:**
- `role`: Filter by role (teen, admin, usher, temp_usher)
- `is_active`: Filter by active status (true/false)
- `search`: Search in name/email

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://api.example.com/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "email": "john@example.com",
      "full_name": "John Doe",
      "role": "teen",
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/users/`
Create a new user (admin only).

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Request Body:** Same as registration endpoint

#### GET `/api/users/{id}/`
Get user details.

**Authentication:** JWT required
**Permissions:** IsAuthenticated (own profile) or IsAdminUser

#### PUT `/api/users/{id}/`
Update user details.

**Authentication:** JWT required
**Permissions:** IsAuthenticated (own profile) or IsAdminUser

#### DELETE `/api/users/{id}/`
Deactivate user account.

**Authentication:** JWT required
**Permissions:** IsAdminUser

#### GET `/api/users/me/`
Get current authenticated user details.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

## Attendance Management Endpoints

### Attendance Records

#### GET `/api/attendance/`
List attendance records.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Query Parameters:**
- `date`: Filter by date (YYYY-MM-DD)
- `location`: Filter by location
- `user`: Filter by user ID (admin only)
- `method`: Filter by check-in method
- `status`: Filter by status

**Response (200 OK):**
```json
{
  "count": 150,
  "results": [
    {
      "id": 456,
      "user": 123,
      "user_name": "John Doe",
      "method": "qr_scan",
      "status": "present",
      "check_in_time": "2024-01-15T10:30:00Z",
      "check_in_date": "2024-01-15",
      "service": "Sunday Service",
      "location": "Main Sanctuary",
      "processed_by": 124,
      "processed_by_name": "Jane Usher",
      "notes": "Arrived with family",
      "scan_data": "12345"
    }
  ]
}
```

#### POST `/api/attendance/`
Create new attendance record.

**Authentication:** JWT required
**Permissions:** IsUsherOrAdmin

**Request Body:**
```json
{
  "user": 123,
  "method": "qr_scan",
  "status": "present",
  "service": "Sunday Service",
  "location": "Main Sanctuary",
  "notes": "Optional notes",
  "scan_data": "12345"
}
```

#### GET `/api/attendance/{id}/`
Get attendance record details.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

#### PUT `/api/attendance/{id}/`
Update attendance record.

**Authentication:** JWT required
**Permissions:** IsAdminUser or record owner

#### DELETE `/api/attendance/{id}/`
Delete attendance record.

**Authentication:** JWT required
**Permissions:** IsAdminUser

#### POST `/api/attendance/bulk/`
Bulk create attendance records.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Request Body:**
```json
{
  "records": [
    {
      "user": 123,
      "method": "manual",
      "status": "present",
      "service": "Sunday Service",
      "location": "Main Sanctuary"
    },
    {
      "user": 124,
      "method": "manual",
      "status": "absent",
      "service": "Sunday Service",
      "location": "Main Sanctuary",
      "notes": "Family emergency"
    }
  ]
}
```

## Usher Assignment Endpoints

### Assignment Management

#### GET `/api/usher-assignments/`
List usher assignments.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Query Parameters:**
- `status`: Filter by status (active, expired, revoked)
- `user`: Filter by assigned user
- `location`: Filter by location

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": 789,
      "user": 123,
      "user_name": "John Doe",
      "assigned_by": 1,
      "assigned_by_name": "Admin User",
      "assigned_at": "2024-01-15T09:00:00Z",
      "expires_at": "2024-01-15T12:00:00Z",
      "status": "active",
      "location": "Main Sanctuary",
      "permission_level": "standard",
      "temp_username": "usher_123_1705312800",
      "check_ins_processed": 12,
      "qr_scans_processed": 8,
      "bol_key_entries": 4
    }
  ]
}
```

#### POST `/api/usher-assignments/`
Create new usher assignment.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Request Body:**
```json
{
  "user": 123,
  "location": "Main Sanctuary",
  "permission_level": "standard",
  "expires_at": "2024-01-15T12:00:00Z"
}
```

#### GET `/api/usher-assignments/{id}/`
Get assignment details.

**Authentication:** JWT required
**Permissions:** IsAdminUser

#### PUT `/api/usher-assignments/{id}/`
Update assignment.

**Authentication:** JWT required
**Permissions:** IsAdminUser

#### DELETE `/api/usher-assignments/{id}/`
Delete assignment.

**Authentication:** JWT required
**Permissions:** IsAdminUser

#### POST `/api/usher-assignments/{id}/revoke/`
Revoke active assignment.

**Authentication:** JWT required
**Permissions:** IsAdminUser

## Shepherding Endpoints

### Contact Management

#### GET `/api/shepherding/contacts/`
List shepherding contacts.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Query Parameters:**
- `shepherd`: Filter by shepherd user ID
- `member`: Filter by member user ID
- `contact_method`: Filter by contact method
- `date_from`: Filter from date
- `date_to`: Filter to date

**Response (200 OK):**
```json
{
  "count": 25,
  "results": [
    {
      "id": 101,
      "shepherd": 1,
      "shepherd_name": "Admin User",
      "member": 123,
      "member_name": "John Doe",
      "contact_method": "phone",
      "contact_info": "(555) 123-4567",
      "contact_date": "2024-01-15T14:30:00Z",
      "notes": "Discussed youth group participation and upcoming events",
      "follow_up_required": false,
      "follow_up_date": null
    }
  ]
}
```

#### POST `/api/shepherding/contacts/`
Create new shepherding contact.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Request Body:**
```json
{
  "member": 123,
  "contact_method": "phone",
  "contact_info": "(555) 123-4567",
  "notes": "Discussed youth group participation",
  "follow_up_required": true,
  "follow_up_date": "2024-01-22T14:30:00Z"
}
```

#### GET `/api/shepherding/contacts/{id}/`
Get contact details.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

#### PUT `/api/shepherding/contacts/{id}/`
Update contact.

**Authentication:** JWT required
**Permissions:** IsAuthenticated (own contacts) or IsAdminUser

#### DELETE `/api/shepherding/contacts/{id}/`
Delete contact.

**Authentication:** JWT required
**Permissions:** IsAuthenticated (own contacts) or IsAdminUser

## Analytics & Reporting Endpoints

### Weekly Attendance Summaries

#### GET `/api/analytics/weekly-attendance/`
Get weekly attendance summaries.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Query Parameters:**
- `year`: Filter by year
- `week_number`: Filter by week number
- `location`: Filter by location

**Response (200 OK):**
```json
{
  "count": 52,
  "results": [
    {
      "id": 202,
      "week_start_date": "2024-01-14",
      "week_end_date": "2024-01-20",
      "week_number": 3,
      "year": 2024,
      "service": "Sunday Service",
      "location": "Main Sanctuary",
      "total_attendees": 145,
      "member_attendees": 120,
      "visitor_attendees": 25,
      "first_time_visitors": 8,
      "male_attendees": 65,
      "female_attendees": 80,
      "age_group_13_15": 25,
      "age_group_16_18": 35,
      "age_group_19_plus": 85,
      "offering_amount": 1250.00,
      "notes": "Great turnout for special service",
      "created_at": "2024-01-21T08:00:00Z",
      "created_by": 1,
      "attendance_percentage": 85.2
    }
  ]
}
```

#### GET `/api/analytics/attendance-trends/`
Get attendance trends data.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Query Parameters:**
- `months`: Number of months to include (default: 12)
- `location`: Filter by location

**Response (200 OK):**
```json
{
  "trends": [
    {
      "month": "2024-01",
      "total_attendees": 1450,
      "member_attendees": 1200,
      "visitor_attendees": 250,
      "weeks": [
        {"week": 1, "attendees": 320},
        {"week": 2, "attendees": 345},
        {"week": 3, "attendees": 380},
        {"week": 4, "attendees": 405}
      ]
    }
  ]
}
```

### Usher Performance

#### GET `/api/analytics/usher-performance/`
Get usher performance metrics.

**Authentication:** JWT required
**Permissions:** IsAdminUser

**Query Parameters:**
- `date`: Specific date (YYYY-MM-DD)
- `date_from`: Date range start
- `date_to`: Date range end
- `usher`: Filter by usher user ID

**Response (200 OK):**
```json
{
  "performance": [
    {
      "usher_id": 124,
      "usher_name": "Jane Usher",
      "date": "2024-01-15",
      "check_ins_processed": 45,
      "qr_scans_processed": 32,
      "bol_key_entries": 13,
      "total_check_ins": 45,
      "average_processing_time": 12.5
    }
  ]
}
```

## Real-time WebSocket Endpoints

### Attendance Live Updates

#### WebSocket `/ws/attendance/{location}/`
Real-time attendance updates for specific location.

**Authentication:** JWT required (via query parameter)
**Permissions:** IsAuthenticated

**Connection URL:**
```
ws://api.example.com/ws/attendance/main-sanctuary/?token=<jwt_token>
```

**Incoming Messages:**
```json
{
  "type": "attendance_update",
  "data": {
    "user_id": 123,
    "user_name": "John Doe",
    "method": "qr_scan",
    "timestamp": "2024-01-15T10:30:00Z",
    "location": "Main Sanctuary"
  }
}
```

**Outgoing Messages:**
```json
{
  "type": "attendance_update",
  "data": {
    "user_id": 123,
    "user_name": "John Doe",
    "method": "qr_scan",
    "timestamp": "2024-01-15T10:30:00Z",
    "location": "Main Sanctuary",
    "processed_by": 124
  }
}
```

## File Upload Endpoints

### Profile Photos

#### POST `/api/upload/profile-photo/`
Upload user profile photo.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Request:** Multipart form data
- `photo`: Image file (max 5MB, JPEG/PNG)

**Response (201 Created):**
```json
{
  "photo_url": "https://storage.example.com/photos/user_123_1705312800.jpg",
  "thumbnail_url": "https://storage.example.com/photos/thumbnails/user_123_1705312800.jpg"
}
```

## System Configuration Endpoints

### Locations

#### GET `/api/config/locations/`
Get available locations.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Response (200 OK):**
```json
[
  "Main Campus",
  "Downtown Branch",
  "Riverside Campus",
  "Hillcrest Center",
  "East Legon",
  "Cantonments",
  "Tema",
  "Accra Central",
  "Takoradi",
  "Kumasi"
]
```

### Permission Levels

#### GET `/api/config/permission-levels/`
Get usher permission levels.

**Authentication:** JWT required
**Permissions:** IsAuthenticated

**Response (200 OK):**
```json
[
  {
    "value": "standard",
    "label": "Standard - Can scan QR codes and process check-ins"
  },
  {
    "value": "lead",
    "label": "Lead - Can manage check-ins and view reports"
  },
  {
    "value": "senior",
    "label": "Senior - Full access including usher management"
  }
]
```

## Error Response Format

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid",
    "details": {
      "email": ["This field is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

## Rate Limiting

- **Authentication endpoints:** 5 requests per minute per IP
- **User management:** 100 requests per hour per user
- **Attendance endpoints:** 500 requests per hour per user
- **Analytics endpoints:** 50 requests per hour per user

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 25, max: 100)

Pagination metadata is included in list responses:
```json
{
  "count": 150,
  "next": "http://api.example.com/api/users/?page=2",
  "previous": null,
  "results": [...]
}
```

## API Versioning

All endpoints are prefixed with `/api/` and currently at version 1. Future versions will use URL path versioning:
- `/api/v1/users/`
- `/api/v2/users/`

## Content Types

- **Request:** `application/json` for JSON data, `multipart/form-data` for file uploads
- **Response:** `application/json` for all responses
- **Encoding:** UTF-8

This comprehensive API specification provides all endpoints needed for the BOL-TAS church management system, ensuring proper authentication, authorization, and data management.</content>
</xai:function_call">The API endpoints specification has been created in `DJANGO_API_ENDPOINTS.md`. This focused document details all REST API endpoints organized by functionality:

## Key Sections:

### **Authentication Endpoints**
- JWT token obtain/refresh
- User registration and profile management
- Password change functionality

### **User Management**
- CRUD operations for users
- Role-based access control
- Current user endpoint

### **Attendance Management**
- Attendance record CRUD
- Bulk operations
- Filtering by date, location, user, etc.

### **Usher Assignments**
- Assignment creation and management
- Revocation functionality
- Performance tracking

### **Shepherding**
- Contact logging and management
- Follow-up tracking

### **Analytics & Reporting**
- Weekly attendance summaries
- Trend analysis
- Usher performance metrics

### **Real-time Features**
- WebSocket endpoints for live updates
- Location-based attendance broadcasting

### **File Management**
- Profile photo uploads
- File storage integration

### **Configuration**
- System settings and constants
- Location and permission level data

### **Technical Details**
- Request/response formats
- Error handling
- Rate limiting
- Pagination
- Authentication requirements

The document provides complete API specifications with HTTP methods, authentication requirements, request/response examples, and error handling for all endpoints needed by the BOL-TAS frontend.