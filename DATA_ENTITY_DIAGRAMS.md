# BOL-TAS Data Entity Diagrams (Corrected & Normalized)

## Overview

This document provides corrected and normalized Mermaid class diagrams for each data entity in the BOL-TAS system, showing their attributes, types, and relationships.

## Core Data Entities

### 1. User Account Entity

```mermaid
classDiagram
    class UserAccount {
        +number id
        +string name
        +string email
        +string password
        +string role
        +string createdAt
        +string bolKey?
        +number tempUsherExpiration?
        +string usherAssignmentId?
    }

    note for UserAccount "Stored in localStorage as 'userAccount'\nRoles: 'teen', 'admin', 'tempUsher'"
```

### 2. Member Profile Entity (Corrected)

```mermaid
classDiagram
    class MemberProfile {
        +string fullName
        +string preferredName
        +string dateOfBirth
        +string gender
        +File profilePhoto?
        +string email
        +string phoneNumber
        +string guardianName
        +string guardianPhone
        +string guardianEmail
        +string emergencyContact
        +string ministry
        +string membershipStatus
        +boolean parentalConsent
        +string attendanceRecords
        +string volunteerRoles
    }

    note for MemberProfile "Component state - not persisted\nLinked to UserAccount by email\nRemoved: spiritualMilestones, points, privacySettings"
```

### 3. Attendance Record Entity

```mermaid
classDiagram
    class AttendanceRecord {
        +string method
        +string key
        +string time
        +number timestamp
        +string name?
        +string area?
        +string parent?
    }

    class AdminAttendanceRecord {
        +string id
        +string teenName
        +string teenId
        +string location
        +string checkInTime?
        +string status
        +string usher?
        +string date
        +string notes
    }

    note for AttendanceRecord "Stored in localStorage as 'attendanceLog'\nMethods: 'QR Scan', 'BOL-Key Entry', 'Smart Search'"
    note for AdminAttendanceRecord "Mock data in components\nStatus: 'Present', 'Absent', 'Checked In'"
```

### 4. Usher Assignment Entity

```mermaid
classDiagram
    class UsherAssignment {
        +string id
        +string memberId
        +string assignedBy
        +number assignedAt
        +string tempUsername
        +string tempPassword
        +number expirationTime
        +string location
        +string permissionLevel
        +string status
    }

    note for UsherAssignment "Temporary assignments\nExpires at 12:00 PM\nStatus: 'Active', 'Expired', 'Revoked'"
```

### 5. Admin-Managed Usher Entity

```mermaid
classDiagram
    class AdminUsher {
        +string id
        +string fullName
        +string email
        +string phone
        +string location
        +string permissionLevel
        +string status
        +string createdDate
        +string createdBy
        +string lastLogin
        +string tempPassword?
        +boolean showPassword
    }

    note for AdminUsher "Legacy usher management\nComponent state only\nPermission: 'Standard', 'Lead', 'Senior'"
```

### 6. Church Member Entity

```mermaid
classDiagram
    class ChurchMember {
        +number id
        +string name
        +string area
        +string parent
        +string birthYear
        +string email?
        +string phone?
        +string joinDate?
        +number attendanceStreak?
        +string lastAttendance?
        +string status?
    }

    note for ChurchMember "Mock data for search\nStatus: 'Active', 'Inactive'\nUsed in UsherTerminal search"
```

## UI State Entities

### 7. Form State Entities (Corrected)

```mermaid
classDiagram
    class LoginFormState {
        +string email
        +string password
        +Object errors
        +boolean isSubmitting
    }

    class RegistrationFormState {
        +string name
        +string email
        +string password
        +string confirmPassword
        +Object errors
        +boolean isSubmitting
    }

    note for LoginFormState "Login component state\nErrors: email, password, submit"
    note for RegistrationFormState "CreateAccount component state\nRemoved: role (assigned by admin)"
```

### 8. Usher Terminal State

```mermaid
classDiagram
    class UsherTerminalState {
        +string activeTab
        +string scanResult
        +string bolKeyInput
        +string searchQuery
        +Array~ChurchMember~ searchResults
        +Array~AttendanceRecord~ attendanceLog
        +AttendanceRecord lastCheckIn?
        +boolean showUndo
        +boolean isScanning
        +boolean showSuccessOverlay
    }

    note for UsherTerminalState "UsherTerminal component state\nactiveTab: 'qr', 'key', 'search'\nPersisted: attendanceLog only"
```

### 9. Admin Dashboard State

```mermaid
classDiagram
    class MembersManagementState {
        +Array~ChurchMember~ members
        +boolean showAddModal
        +boolean showEditModal
        +boolean showConfirmModal
        +string confirmAction?
        +any confirmData?
        +ChurchMember editingMember?
        +string searchTerm
        +string selectedLocation
        +Object formData
        +string message
        +string messageType
    }

    class AttendanceManagementState {
        +string selectedDate
        +string selectedLocation
        +string searchTerm
        +Array~AdminAttendanceRecord~ attendanceRecords
    }

    note for MembersManagementState "MembersPage component state\nconfirmAction: 'delete', 'deactivate'"
    note for AttendanceManagementState "AttendancePage component state\nDate format: YYYY-MM-DD"
```

## Analytics & Reporting Entities

### 10. Attendance Analytics Entity

```mermaid
classDiagram
    class WeeklyAttendanceData {
        +string week
        +number visitors
        +number members
    }

    class MonthlyAttendanceData {
        +string month
        +Array~WeeklyAttendanceData~ weeks
    }

    class SundayAttendanceSummary {
        +number boys
        +number girls
        +number totalAttendance
    }

    note for WeeklyAttendanceData "Chart data structure\nweek: 'Week 1', 'Week 2', etc."
    note for MonthlyAttendanceData "12 months of weekly data\nUsed in AttendanceTrendsChart"
    note for SundayAttendanceSummary "Dashboard progress bars\nPercentages of total attendance"
```

### 11. Usher Performance Entity

```mermaid
classDiagram
    class UsherPerformance {
        +string usherName
        +number scanCount
        +number bolKeyEntries
        +number totalCheckIns
        +string date
    }

    note for UsherPerformance "AdminMain dashboard display\nShows today's performance\nbolKeyEntries: BOL-key usage count"
```

## Configuration & Static Entities

### 12. System Configuration Entities

```mermaid
classDiagram
    class LocationConfig {
        +Array~string~ locations
    }

    class PermissionLevel {
        +string value
        +string label
    }

    class UserRole {
        +string teen
        +string admin
        +string tempUsher
    }

    note for LocationConfig "Static location options\nUsed in forms and filters"
    note for PermissionLevel "Usher permission levels\nvalue: 'Standard', 'Lead', 'Senior'"
    note for UserRole "System role constants\nExtended for tempUsher"
```

### 13. UI Configuration Entities

```mermaid
classDiagram
    class ChartConfig {
        +Object visitors
        +Object members
    }

    class ChartDataPoint {
        +string label
        +string color
    }

    note for ChartConfig "Recharts configuration\nvisitors/members styling"
    note for ChartDataPoint "Chart legend items\nColor: HSL values"
```

## Normalized Entity Relationships

```mermaid
erDiagram
    UserAccount ||--o{ MemberProfile : has
    UserAccount ||--o{ UsherAssignment : assigned
    MemberProfile ||--o{ AttendanceRecord : creates
    UsherAssignment ||--o{ AttendanceRecord : enables
    AdminUsher ||--o{ AttendanceRecord : manages
    ChurchMember ||--o{ AttendanceRecord : referenced

    UserAccount {
        number id PK
        string email UK
        string role
    }

    MemberProfile {
        string email FK
        string fullName
        string phoneNumber
    }

    UsherAssignment {
        string id PK
        string memberId FK
        number expirationTime
    }

    AttendanceRecord {
        number timestamp PK
        string method
        string key
    }
```

## Normalized Storage Pattern Relationships

```mermaid
graph TD
    A[localStorage] --> B[UserAccount]
    A --> C[AttendanceRecord Array]
    A --> D[Session Preferences]

    E[Component State] --> F[MemberProfile]
    E --> G[Form States]
    E --> H[UI Interaction States]
    E --> I[Admin Dashboard Data]

    J[Mock Data] --> K[ChurchMember Array]
    J --> L[Sample Attendance Records]
    J --> M[Configuration Constants]

    N[Computed Data] --> O[Statistics]
    N --> P[Filtered Views]
    N --> Q[Aggregations]
    N --> R[Chart Data]
```

## Summary of Corrections Made

### Entity #2 - Member Profile Entity
- **Removed**: `spiritualMilestones`, `points`, `privacySettings` fields
- **Reason**: Streamlined profile to focus on essential member information

### Entity #7 - Registration Form State
- **Removed**: `role` field
- **Reason**: Roles are now assigned by admin, not selected during registration
- **Updated**: Streamlined to member-focused registration
- **Default**: All new users automatically assigned 'teen' role

### Normalization Applied
- **Consistent field naming** across all entities
- **Proper relationship definitions** in ER diagram
- **Clear storage pattern documentation**
- **Updated notes** reflecting corrections

## Final Data Model Structure

The corrected data model now properly supports:
- **Admin-controlled role assignment** (no self-selection of roles)
- **Streamlined member profiles** (removed non-essential fields)
- **Backend-driven authentication** with role validation
- **Role-based redirection** after successful login
- **Exclusive usher access** through admin assignment only
- **Church-appropriate user onboarding** focused on membership
- **Temporary usher assignments** with proper expiration
- **Clean separation** between permanent and temporary roles

All entities are now normalized and properly documented for implementation.