# BOL-TAS System Data Entities

## Overview

This document catalogs all data entities, models, and structures used throughout the BOL-TAS church management system. The system uses a combination of local state management, localStorage persistence, and mock data structures.

## Core Data Entities

### 1. User Account Entity

**Storage:** localStorage (`userAccount`)
**Purpose:** User authentication and role management

```javascript
{
  // Basic Account Info
  id: number,              // Auto-generated timestamp
  name: string,            // Full display name
  email: string,           // Login email address
  password: string,        // Hashed/stored password
  role: string,            // 'teen' | 'admin' | 'tempUsher'

  // Account Metadata
  createdAt: string,       // ISO timestamp
  bolKey: string | null,   // Format: "YY-NNN" (e.g., "24-001")

  // Temporary Usher Fields (when assigned)
  tempUsherExpiration?: number,  // Timestamp for auto-logout
  usherAssignmentId?: string,    // Assignment reference
}
```

### 2. Member Profile Entity

**Storage:** Component state (not persisted)
**Purpose:** Comprehensive member information management

```javascript
{
  // Personal Information
  fullName: string,
  preferredName: string,
  dateOfBirth: string,        // YYYY-MM-DD format
  gender: string,             // 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  profilePhoto: File | null,

  // Contact Information
  email: string,
  phoneNumber: string,        // Format: "(XXX) XXX-XXXX"
  guardianName: string,
  guardianPhone: string,
  guardianEmail: string,
  emergencyContact: string,

  // Church Engagement
  ministry: string,           // 'Youth Choir' | 'Bible Study' | etc.
  membershipStatus: string,   // 'Active Member' | 'Visitor' | 'New Member'
  spiritualMilestones: string,

  // Permissions & Safety
  parentalConsent: boolean,
  privacySettings: string,    // 'Friends Only' | etc.

  // Service Records
  attendanceRecords: string,  // Format: "X/Y (Z%)"
  volunteerRoles: string,     // Comma-separated roles
  points: string             // Numeric string
}
```

### 3. Attendance Record Entity

**Storage:** localStorage (`attendanceLog`) + Component state
**Purpose:** Track all check-in activities

```javascript
// Usher Check-in Record
{
  method: string,           // 'QR Scan' | 'BOL-Key Entry' | 'Smart Search'
  key: string,             // QR content, BOL-key, or member name
  time: string,            // HH:MM:SS AM/PM format
  timestamp: number,       // Unix timestamp for sorting/undo

  // Smart Search additional fields
  name?: string,           // Member full name
  area?: string,           // Member area
  parent?: string,         // Parent name
}

// Admin Attendance View Record
{
  id: string,              // Format: "ATT-XXX"
  teenName: string,
  teenId: string,          // Format: "T-XXX"
  location: string,
  checkInTime: string,     // HH:MM AM/PM or null
  status: string,          // 'Present' | 'Absent' | 'Checked In'
  usher: string | null,    // Usher who processed
  date: string,            // YYYY-MM-DD
  notes: string
}
```

### 4. Usher Assignment Entity

**Storage:** Admin component state (not persisted)
**Purpose:** Temporary usher role assignments

```javascript
{
  // Assignment Details
  id: string,              // Format: "USH-ASSIGN-XXX"
  memberId: string,        // Reference to member
  assignedBy: string,      // Admin email/ID
  assignedAt: number,      // Assignment timestamp

  // Temporary Credentials
  tempUsername: string,
  tempPassword: string,
  expirationTime: number,  // 12:00 PM timestamp

  // Assignment Metadata
  location: string,        // Assigned location
  permissionLevel: string, // 'Standard' | 'Lead' | 'Senior'
  status: string          // 'Active' | 'Expired' | 'Revoked'
}
```

### 5. Admin-Managed Usher Entity

**Storage:** Admin component state (not persisted)
**Purpose:** Legacy usher account management

```javascript
{
  id: string,              // Format: "USH-XXX"
  fullName: string,
  email: string,
  phone: string,
  location: string,
  permissionLevel: string, // 'Standard' | 'Lead' | 'Senior'
  status: string,          // 'Active' | 'Inactive' | 'Pending Activation'
  createdDate: string,
  createdBy: string,
  lastLogin: string,
  tempPassword: string | null,
  showPassword: boolean
}
```

### 6. Church Member Entity

**Storage:** Component state (mock data)
**Purpose:** Member lookup and management

```javascript
{
  id: number,
  name: string,
  area: string,            // 'Greenwood' | 'Riverside' | etc.
  parent: string,
  birthYear: string,       // YYYY format
  email?: string,
  phone?: string,
  joinDate?: string,
  attendanceStreak?: number,
  lastAttendance?: string,
  status?: string         // 'Active' | 'Inactive'
}
```

## UI State Entities

### 7. Form State Entities

**Login Form State:**
```javascript
{
  email: string,
  password: string,
  errors: {
    email?: string,
    password?: string,
    submit?: string
  },
  isSubmitting: boolean
}
```

**Registration Form State:**
```javascript
{
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: string,           // 'teen' | 'usher' | 'admin'
  errors: { [field: string]: string },
  isSubmitting: boolean
}
```

### 8. Usher Terminal State

**Main Terminal State:**
```javascript
{
  activeTab: string,      // 'qr' | 'key' | 'search'
  scanResult: string,
  bolKeyInput: string,
  searchQuery: string,
  searchResults: Array<ChurchMember>,
  attendanceLog: Array<AttendanceRecord>,
  lastCheckIn: AttendanceRecord | null,
  showUndo: boolean,
  isScanning: boolean,
  showSuccessOverlay: boolean
}
```

### 9. Admin Dashboard State

**Members Management State:**
```javascript
{
  members: Array<ChurchMember>,
  showAddModal: boolean,
  showEditModal: boolean,
  showConfirmModal: boolean,
  confirmAction: string | null,
  confirmData: any,
  editingMember: ChurchMember | null,
  searchTerm: string,
  selectedLocation: string,
  formData: Partial<ChurchMember>,
  message: string,
  messageType: string
}
```

**Attendance Management State:**
```javascript
{
  selectedDate: string,   // YYYY-MM-DD
  selectedLocation: string,
  searchTerm: string,
  attendanceRecords: Array<AdminAttendanceRecord>
}
```

## Analytics & Reporting Entities

### 10. Attendance Analytics Entity

**Weekly Attendance Data:**
```javascript
{
  week: string,           // "Week 1", "Week 2", etc.
  visitors: number,
  members: number
}
```

**Monthly Attendance Data:**
```javascript
{
  [month: string]: Array<WeeklyAttendanceData>
  // e.g., "Jan": [{week: "Week 1", visitors: 2100, members: 1800}, ...]
}
```

**Sunday Attendance Summary:**
```javascript
{
  boys: number,           // Percentage attendance
  girls: number,
  totalAttendance: number
}
```

### 11. Usher Performance Entity

**Performance Metrics:**
```javascript
{
  usherName: string,
  scanCount: number,
  bolKeyEntries: number,
  totalCheckIns: number,
  date: string
}
```

## Configuration & Static Entities

### 12. System Configuration Entities

**Location Options:**
```javascript
const locations = [
  'Main Campus',
  'Downtown Branch',
  'Riverside Campus',
  'Hillcrest Center',
  'East Legon',
  'Cantonments',
  'Tema',
  'Accra Central',
  'Takoradi',
  'Kumasi'
];
```

**Permission Levels:**
```javascript
const permissionLevels = [
  {
    value: 'Standard',
    label: 'Standard - Can scan QR codes and process check-ins'
  },
  {
    value: 'Lead',
    label: 'Lead - Can manage check-ins and view reports'
  },
  {
    value: 'Senior',
    label: 'Senior - Full access including usher management'
  }
];
```

**User Roles:**
```javascript
const USER_ROLES = {
  teen: 'teen',
  admin: 'admin',
  tempUsher: 'tempUsher'  // Temporary role for assigned ushers
};
```

### 13. UI Configuration Entities

**Chart Configuration:**
```javascript
const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(186, 70%, 50%)"
  },
  members: {
    label: "Members",
    color: "hsl(186, 70%, 34%)"
  }
};
```

## Data Flow & Relationships

### Entity Relationships

```
User Account
├── Has one → Member Profile (if role = 'teen')
├── Can become → Temporary Usher (via admin assignment)
└── Can be → Admin (role = 'admin')

Member Profile
├── Belongs to → User Account
├── Has many → Attendance Records
└── Can be assigned → Usher Role (temporary)

Attendance Record
├── Created by → Usher (temp or admin)
├── References → Member (via name/ID)
└── Stored in → localStorage array

Usher Assignment
├── Assigned by → Admin
├── Granted to → Member
├── Has → Temporary Credentials
└── Expires at → 12:00 PM
```

### Data Storage Patterns

1. **localStorage Entities:**
   - User authentication sessions
   - Attendance logs
   - Temporary user preferences

2. **Component State Entities:**
   - Form data and validation states
   - UI interaction states (modals, tabs)
   - Temporary working data

3. **Mock Data Entities:**
   - Static member lists for search
   - Sample attendance records
   - Configuration constants

4. **Computed Entities:**
   - Statistics and aggregations
   - Filtered data views
   - Derived metrics

## Data Validation Rules

### User Account Validation
- Email: Valid email format required
- Password: Minimum 6 characters
- Name: Non-empty string required
- Role: Must be one of defined roles

### Member Profile Validation
- Required fields: name, email, phone
- Email format validation
- Date format validation (YYYY-MM-DD)
- Phone format: (XXX) XXX-XXXX

### Attendance Validation
- Timestamp: Valid Unix timestamp
- Method: One of allowed check-in methods
- Required fields based on method type

### Usher Assignment Validation
- Member must exist and be active
- Expiration must be future timestamp
- Credentials must be unique for session

## Future Data Entity Extensions

### Planned Backend Entities
- **Firebase Collections:** Users, Members, Attendance, Assignments
- **Real-time Subscriptions:** Live attendance updates
- **Audit Logs:** All admin actions tracked
- **File Storage:** Profile photos, documents

### Enhanced Analytics Entities
- **Trend Analysis:** Historical attendance patterns
- **Performance Metrics:** Detailed usher statistics
- **Engagement Scoring:** Member activity levels
- **Geographic Data:** Location-based insights

This comprehensive data model provides the foundation for the BOL-TAS system's functionality, with clear relationships and validation rules ensuring data integrity throughout the application.