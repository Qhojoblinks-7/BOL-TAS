# BOL-TAS Data Flow Architecture

## System Data Flow Overview

```mermaid
graph TD
     A[User Interaction] --> B{Authentication Check}

     B -->|No Auth| C[CreateAccount/Login]
     C --> D[localStorage: userAccount]
     D --> E[Custom Events: userLoggedIn]
     E --> F[App.jsx State Update]

     B -->|Authenticated| G{Role-Based Routing}

     G -->|Admin| H[AdminLayout + AdminMain]
     G -->|Teen| I[TeenPortal]
     G -->|Usher| J[UsherTerminal]

     H --> K[Admin Components]
     K --> L[Local State Management]
     L --> M[Mock Data Arrays]
     M --> N[UI Rendering]

     I --> O[Teen Components]
     O --> P[localStorage: Profile Data]
     P --> Q[UI Rendering]

     J --> R[Usher Components]
     R --> S[QR Scanner]
     S --> T[Scan Processing]
     T --> U[localStorage: attendanceLog]
     U --> V[Success Feedback]

     R --> W[BOL-Key Input]
     W --> X[Key Validation]
     X --> U

     R --> Y[Smart Search]
     Y --> Z[Mock Members Array]
     Z --> AA[Search Results]
     AA --> U

     F --> BB[Redux Store]
     BB --> CC[Global State]

     DD[Firebase Config] --> EE[Firestore Collections]
     EE --> FF[Future Data Layer]
     FF -.->|Planned| L
     FF -.->|Planned| P
     FF -.->|Planned| U
```

## Detailed Data Flow Diagrams

### QR Code Attendance Flow

```mermaid
sequenceDiagram
    participant Member
    participant Usher
    participant QRScanner
    participant Validation
    participant Storage

    Member->>Usher: Shows QR code
    Usher->>QRScanner: Initiates scan
    QRScanner->>QRScanner: Camera captures QR
    QRScanner->>Validation: Decodes QR content
    Validation->>Validation: Check format & member lookup
    Validation->>Usher: Show member details
    Usher->>Validation: Confirm attendance
    Validation->>Storage: Log attendance record
    Storage->>Usher: Success confirmation
    Usher->>Member: Check-in complete
```

### BOL-Key Check-in Flow

```mermaid
sequenceDiagram
    participant Member
    participant Usher
    participant Keypad
    participant Validation
    participant Storage

    Member->>Usher: Provides 5-digit code
    Usher->>Keypad: Enters code digits
    Keypad->>Validation: Submit for validation
    Validation->>Validation: Verify format (5 digits)
    Validation->>Validation: Lookup member by code
    Validation->>Usher: Display member info
    Usher->>Validation: Confirm check-in
    Validation->>Storage: Create attendance record
    Storage->>Usher: Show success message
```

### Admin Member Management Flow

```mermaid
graph TD
    A[Admin Dashboard] --> B{Action Type}
    B -->|View| C[Load Members Array]
    B -->|Add| D[Show Add Modal]
    B -->|Edit| E[Show Edit Modal]
    B -->|Delete| F[Show Confirm Modal]

    C --> G[Display Members Table]
    D --> H[Form Validation]
    E --> I[Populate Form]
    F --> J[Confirmation Dialog]

    H --> K{Valid?}
    I --> L[Form Validation]
    L --> M{Valid?}

    K -->|No| N[Show Errors]
    M -->|No| O[Show Errors]
    K -->|Yes| P[Add to Array]
    M -->|Yes| Q[Update Array]

    J --> R{Confirmed?}
    R -->|No| S[Cancel]
    R -->|Yes| T[Remove from Array]

    P --> U[Update UI]
    Q --> U
    T --> U
    N --> V[Retry]
    O --> V
    S --> W[Close Modal]
```

## Key Data Flow Patterns

### **Authentication Flow**
1. **User Input** → Form validation → localStorage check
2. **Success** → Custom event dispatch → App state update → Route navigation
3. **Persistence** → localStorage maintains session across browser refreshes

### **Admin Data Flow**
1. **Component Mount** → Initialize local state with mock data arrays
2. **User Actions** → State updates (add/edit/delete members)
3. **Data Storage** → Currently in-memory only (no persistence)
4. **UI Updates** → React re-renders based on state changes

### **Usher Terminal Data Flow**
1. **QR Scanning** → Camera access → QR code detection → Result processing
2. **BOL-Key Entry** → Keypad input → Format validation → Check-in processing
3. **Smart Search** → Text input → Mock data filtering → Selection → Check-in
4. **Attendance Logging** → All check-in methods → localStorage persistence
5. **Undo Functionality** → Timestamp-based reversal → State cleanup

### **Teen Portal Data Flow**
1. **Profile Management** → Form inputs → localStorage updates
2. **Security Settings** → Recovery method configuration → localStorage
3. **ID Management** → Static display (currently no dynamic data)

### **State Management Layers**

#### **Local Component State**
- Form inputs, modal visibility, search filters
- Immediate UI feedback and validation

#### **Local Storage Persistence**
- User authentication sessions
- Attendance logs (usher terminal)
- Profile data (teen portal)

#### **Redux Store** (Configured but not actively used)
- Global state management infrastructure ready for expansion

#### **Firebase Integration** (Planned/Infrastructure Only)
- Firestore collections defined but not connected
- Authentication service configured but bypassed
- Real-time data synchronization not implemented

## Current Implementation Status

### **Fully Implemented**
- Role-based routing and UI
- QR code scanning and processing
- BOL-key entry system
- Smart search functionality
- Local storage persistence for sessions and logs

### **Partially Implemented**
- Redux store (configured but not used)
- Firebase services (configured but not connected)

### **Mock Data Dependencies**
- Member management uses hardcoded arrays
- Search functionality uses mock member data
- No real database integration yet

### **Data Synchronization**
- Cross-tab communication via custom events
- localStorage change listeners for multi-tab support
- No server-side synchronization currently

This architecture shows a system in active development with a solid frontend foundation and Firebase infrastructure ready for full backend integration.