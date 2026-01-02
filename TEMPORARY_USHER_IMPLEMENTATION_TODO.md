# Temporary Usher Assignment Implementation Plan

## Overview
Implementation of the temporary usher assignment system as described in TEMPORARY_USHER_ASSIGNMENT_WORKFLOW.md. This system allows admins to assign temporary usher duties to existing teen members for specific time periods, with automatic expiration at 12:00 PM.

**Additional Implementation**: Admin Usher Terminal (`AdminUsherTerminal.jsx`) - Provides administrators with direct access to usher functionality through the admin interface, including global search integration and modal-based error handling.

## Implementation Status

### ✅ Completed Features
- [x] Admin Usher Assignment Interface - MembersPage includes usher assignment actions
- [x] Teen Portal Updates - TeenPortal detects and displays assignments
- [x] Routing & Role Management - App.jsx supports tempUsher role
- [x] Usher Terminal Expiration - Automatic logout at 12:00 PM
- [x] State Management & Persistence - localStorage for assignments
- [x] Admin Management Features - Assignment revocation capabilities
- [x] Admin Usher Terminal - Separate admin interface for usher functionality
- [x] Global Search Integration - TopNav search works with AdminUsherTerminal
- [x] Modal-based Error Handling - QR scan errors displayed as popups

## Key Features to Implement

### 1. Admin Usher Assignment Interface
- [x] Add "Assign Usher Duty" button to MembersPage table actions
- [x] Create assignment modal with member selection confirmation
- [x] Generate unique temporary credentials (username/password) for each assignment
- [x] Set automatic expiration timestamp for 12:00 PM same day
- [x] Store assignment data in database with member ID, credentials, and expiration
- [x] Display assignment status in member list (active/inactive assignments)

### 2. Teen Portal Updates
- [x] Add useEffect to check for active usher assignments on component mount
- [x] Display "Usher Duty" button in navigation when assignment is active
- [x] Create UsherActivationModal component for credential input
- [x] Implement credential validation against stored assignments
- [x] Handle role transition from 'teen' to 'tempUsher' upon successful validation
- [x] Add visual feedback for assignment status

### 3. Routing & Role Management
- [x] Extend App.jsx Routes to support 'tempUsher' role
- [x] Update role detection logic in App.jsx to handle tempUsher transitions
- [x] Ensure tempUsher has access to UsherTerminal but not admin features
- [x] Add role cleanup on expiration (return to 'teen')

### 4. Usher Terminal Expiration
- [x] Add useEffect for continuous time checking in UsherTerminal
- [x] Implement auto-logout when current time >= 12:00 PM
- [x] Clear temporary role and redirect to teen portal
- [x] Add optional countdown timer display
- [x] Handle cleanup of expired assignments from database

### 5. State Management & Persistence
- [x] Extend database schema for temporary assignments
- [x] Add assignment data structure: {memberId, credentials, expiration, assignedBy, assignmentId}
- [x] Implement cross-tab synchronization for role changes
- [x] Add cleanup logic for expired assignments on app load

### 6. Admin Management Features
- [x] Add "Revoke Assignment" functionality to MembersPage
- [x] Display active assignments in UshersPage with member details
- [x] Allow early revocation of assignments before expiration
- [x] Add assignment history/audit trail (optional)

## Implementation Order

### Phase 1: Foundation (Routing & Roles)
- [x] Update App.jsx routing for tempUsher role
- [x] Extend role detection and state management
- [x] Add tempUsher to USER_ROLES constants

### Phase 2: Admin Assignment Interface
- [x] Modify MembersPage to include usher assignment actions
- [x] Implement credential generation logic
- [x] Add assignment storage and retrieval functions

### Phase 3: Teen Portal Integration
- [x] Update TeenPortal to detect and display assignments
- [x] Create UsherActivationModal component
- [x] Implement credential validation flow

### Phase 4: Usher Terminal Expiration
- [x] Add expiration monitoring to UsherTerminal
- [x] Implement auto-logout and role cleanup
- [x] Add visual time remaining indicators

### Phase 5: Management & Cleanup
- [x] Add assignment revocation features
- [x] Implement expired assignment cleanup
- [x] Add status monitoring and reporting

## Technical Requirements

### Data Structures
```javascript
// Temporary Assignment
{
  id: string, // assignment ID
  memberId: string, // member ID
  memberName: string, // for display
  credentials: {
    username: string,
    password: string
  },
  expiration: number, // timestamp
  assignedBy: string, // admin ID
  assignedAt: number, // timestamp
  status: 'active' | 'expired' | 'revoked'
}
```

### Database Collections
- `users`: user accounts and profiles
- `usherAssignments`: temporary usher assignments
- `attendanceRecords`: attendance logging
- `churchMembers`: member information
- `shepherdingContacts`: pastoral care assignments

### Role Transitions
- `teen` → `tempUsher` (on successful credential validation)
- `tempUsher` → `teen` (on expiration or manual logout)

## Testing Scenarios
- [x] Admin assigns usher duty to member
- [x] Member sees "Usher Duty" button in teen portal
- [x] Member enters correct credentials and accesses usher terminal
- [x] Usher terminal auto-logs out at 12:00 PM
- [x] Admin can revoke assignment before expiration
- [x] Expired assignments are cleaned up automatically

## Dependencies
- Existing MembersPage, TeenPortal, UsherTerminal components
- localStorage for data persistence
- Custom events for cross-tab synchronization
- QR code and attendance logging functionality (existing)

---
*This plan implements the workflow described in TEMPORARY_USHER_ASSIGNMENT_WORKFLOW.md*</content>
</xai:function_call">TEMPORARY_USHER_IMPLEMENTATION_TODO.md