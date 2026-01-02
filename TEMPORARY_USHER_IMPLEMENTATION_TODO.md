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
- [ ] Add "Assign Usher Duty" button to MembersPage table actions
- [ ] Create assignment modal with member selection confirmation
- [ ] Generate unique temporary credentials (username/password) for each assignment
- [ ] Set automatic expiration timestamp for 12:00 PM same day
- [ ] Store assignment data in localStorage with member ID, credentials, and expiration
- [ ] Display assignment status in member list (active/inactive assignments)

### 2. Teen Portal Updates
- [ ] Add useEffect to check for active usher assignments on component mount
- [ ] Display "Usher Duty" button in navigation when assignment is active
- [ ] Create UsherActivationModal component for credential input
- [ ] Implement credential validation against stored assignments
- [ ] Handle role transition from 'teen' to 'tempUsher' upon successful validation
- [ ] Add visual feedback for assignment status

### 3. Routing & Role Management
- [ ] Extend App.jsx Routes to support 'tempUsher' role
- [ ] Update role detection logic in App.jsx to handle tempUsher transitions
- [ ] Ensure tempUsher has access to UsherTerminal but not admin features
- [ ] Add role cleanup on expiration (return to 'teen')

### 4. Usher Terminal Expiration
- [ ] Add useEffect for continuous time checking in UsherTerminal
- [ ] Implement auto-logout when current time >= 12:00 PM
- [ ] Clear temporary role and redirect to teen portal
- [ ] Add optional countdown timer display
- [ ] Handle cleanup of expired assignments from localStorage

### 5. State Management & Persistence
- [ ] Extend localStorage schema for temporary assignments
- [ ] Add assignment data structure: {memberId, credentials, expiration, assignedBy, assignmentId}
- [ ] Implement cross-tab synchronization for role changes
- [ ] Add cleanup logic for expired assignments on app load

### 6. Admin Management Features
- [ ] Add "Revoke Assignment" functionality to MembersPage
- [ ] Display active assignments in UshersPage with member details
- [ ] Allow early revocation of assignments before expiration
- [ ] Add assignment history/audit trail (optional)

## Implementation Order

### Phase 1: Foundation (Routing & Roles)
- [ ] Update App.jsx routing for tempUsher role
- [ ] Extend role detection and state management
- [ ] Add tempUsher to USER_ROLES constants

### Phase 2: Admin Assignment Interface
- [ ] Modify MembersPage to include usher assignment actions
- [ ] Implement credential generation logic
- [ ] Add assignment storage and retrieval functions

### Phase 3: Teen Portal Integration
- [ ] Update TeenPortal to detect and display assignments
- [ ] Create UsherActivationModal component
- [ ] Implement credential validation flow

### Phase 4: Usher Terminal Expiration
- [ ] Add expiration monitoring to UsherTerminal
- [ ] Implement auto-logout and role cleanup
- [ ] Add visual time remaining indicators

### Phase 5: Management & Cleanup
- [ ] Add assignment revocation features
- [ ] Implement expired assignment cleanup
- [ ] Add status monitoring and reporting

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

### localStorage Keys
- `userAccount`: existing user session
- `temporaryAssignments`: array of active assignments
- `attendanceLog`: existing attendance data

### Role Transitions
- `teen` → `tempUsher` (on successful credential validation)
- `tempUsher` → `teen` (on expiration or manual logout)

## Testing Scenarios
- [ ] Admin assigns usher duty to member
- [ ] Member sees "Usher Duty" button in teen portal
- [ ] Member enters correct credentials and accesses usher terminal
- [ ] Usher terminal auto-logs out at 12:00 PM
- [ ] Admin can revoke assignment before expiration
- [ ] Expired assignments are cleaned up automatically

## Dependencies
- Existing MembersPage, TeenPortal, UsherTerminal components
- localStorage for data persistence
- Custom events for cross-tab synchronization
- QR code and attendance logging functionality (existing)

---
*This plan implements the workflow described in TEMPORARY_USHER_ASSIGNMENT_WORKFLOW.md*</content>
</xai:function_call">TEMPORARY_USHER_IMPLEMENTATION_TODO.md