# Usher Module Data Flow Documentation

## Overview

This document details the internal data flow and architecture of the Usher Terminal module in the BOL-TAS church management system. The Usher module handles attendance tracking through multiple input methods: QR code scanning, 5-digit code entry, and smart search. The system integrates with a Django backend for data persistence and member management.

## Core Architecture

The Usher Terminal is a single-page application component (`UsherTerminal.jsx`) that manages all attendance operations with local state and localStorage persistence.

## Data Flow Architecture

```mermaid
graph TD
    A[Usher User] --> B[UsherTerminal.jsx Main Component]

    B --> C[State Management]
    C --> D[activeTab: 'qr' | 'key' | 'search']
    C --> E[scanResult: string]
    C --> F[bolKeyInput: string]
    C --> G[searchQuery: string]
    C --> H[searchResults: array]
    C --> I[attendanceLog: array]
    C --> J[lastCheckIn: object]
    C --> K[showUndo: boolean]
    C --> L[isScanning: boolean]
    C --> M[showSuccessOverlay: boolean]

    B --> N[Tab Navigation]
    N --> O[TabNavigation Component]
    O --> P[Tab Switch Handler]
    P --> Q[setActiveTab]

    B --> R[QR SCAN TAB]
    R --> S[QRScanTab Component]
    S --> T[Start Scanning]
    T --> U[Html5QrcodeScanner Init]
    U --> V[Camera Access]
    V --> W[QR Code Detection]
    W --> X[onScanSuccess Callback]
    X --> Y[Process Scanned Data]
    Y --> Z[Create Check-in Record]

    B --> AA[5-DIGIT CODE TAB]
    AA --> BB[FiveDigitCodeTab Component]
    BB --> CC[Keypad Input Handler]
    CC --> DD[Digit/Button Press Logic]
    DD --> EE[Input Validation]
    EE --> FF[Format: NNNNN]
    FF --> GG[Submit Handler]
    GG --> HH[Code Validation]
    HH --> II[5-digit check + member lookup]

    B --> JJ[SEARCH TAB]
    JJ --> KK[SearchTab Component]
    KK --> LL[Text Input Handler]
    KK --> MM[Search Button Handler]
    MM --> NN[Mock Members Array]
    NN --> OO[Name-based Filtering]
    OO --> PP[Search Results Display]
    PP --> QQ[Check-in Button Handler]

    Z --> RR[Common Check-in Processing]
    II --> RR
    QQ --> RR

    RR --> SS[Timestamp Generation]
    SS --> TT[new Date().getTime()]
    TT --> UU[Check-in Object Creation]
    UU --> VV{method, key/name, time, timestamp}
    VV --> WW[Add to attendanceLog]
    WW --> XX[Update lastCheckIn]
    XX --> YY[localStorage Persistence]
    YY --> ZZ[JSON.stringify + save]

    WW --> AAA[Success Feedback]
    AAA --> BBB[showSuccessOverlay = true]
    BBB --> CCC[3-second timeout]
    CCC --> DDD[showSuccessOverlay = false]

    XX --> EEE[Undo Setup]
    EEE --> FFF[showUndo = true]
    FFF --> GGG[5-second timeout]
    GGG --> HHH[showUndo = false]

    HHH --> III[UndoButton Component]
    III --> JJJ[Undo Click Handler]
    JJJ --> KKK[Remove from attendanceLog]
    KKK --> LLL[Filter by timestamp]
    LLL --> MMM[Update localStorage]
    MMM --> NNN[Reset lastCheckIn]
    NNN --> OOO[showUndo = false]

    B --> PPP[SuccessOverlay Component]
    PPP --> QQQ[Animated Success Display]

    B --> RRR[useEffect Hook]
    RRR --> SSS[localStorage Sync]
    SSS --> TTT[Load on Mount]
    TTT --> UUU[Save on attendanceLog Change]

    B --> VVV[Mock Data]
    VVV --> WWW[mockMembers Array]
    WWW --> XXX[Static Member Data]
    XXX --> YYY[Search Operations]

    B --> ZZZ[Error Handling]
    ZZZ --> AAAA[Scan Failure Callback]
    AAAA --> BBBB[Console Warning]
    BBBB --> CCCC[No UI Feedback]
```

## Component Structure

### Main Component: UsherTerminal.jsx

**State Variables:**
- `activeTab`: Current active tab ('qr', 'key', 'search')
- `scanResult`: Last QR scan result
- `bolKeyInput`: Current BOL-key input string
- `searchQuery`: Search input text
- `searchResults`: Filtered member results
- `attendanceLog`: Array of all check-in records
- `lastCheckIn`: Most recent check-in object
- `showUndo`: Undo button visibility flag
- `isScanning`: Camera scanning state
- `showSuccessOverlay`: Success feedback state

**Key Functions:**
- `onScanSuccess()`: Processes QR scan results
- `onScanFailure()`: Handles scan errors
- `startScanning()`: Initializes camera
- `stopScanning()`: Stops camera
- `handleBOLKeySubmit()`: Processes BOL-key check-ins
- `handleKeypadPress()`: Manages keypad input
- `handleSearch()`: Filters member data
- `handleCheckIn()`: Creates check-in records
- `handleUndo()`: Reverses last check-in

### Sub-Components

#### QRScanTab.jsx
- Camera control interface
- QR code detection display
- File upload alternative
- Real-time scanning feedback

#### FiveDigitCodeTab.jsx
- Virtual keypad interface (0-9 digits)
- Input display with masking (NNNNN format)
- Format validation (exactly 5 digits)
- Member lookup and confirmation
- Clear/backspace functionality

#### SearchTab.jsx
- Text input with search icon
- Results display cards
- Member information layout
- Check-in action buttons

#### SuccessOverlay.jsx
- Full-screen success animation
- Auto-dismiss after 3 seconds
- Check mark icon with bounce effect

#### UndoButton.jsx
- Floating action button
- Positioned bottom-right
- Auto-hide after 5 seconds
- Red styling for destructive action

## Data Flow Patterns

### 1. State Initialization & Persistence

```javascript
// Load from localStorage on mount
const [attendanceLog, setAttendanceLog] = useState(() => {
  const cached = localStorage.getItem('attendanceLog');
  return cached ? JSON.parse(cached) : [];
});

// Save to localStorage on changes
useEffect(() => {
  localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
}, [attendanceLog]);
```

### 2. QR Scanning Flow

1. **User Action** → Click "Start Camera Scan"
2. **Camera Access** → Html5QrcodeScanner initialization
3. **QR Detection** → Real-time scanning with visual feedback
4. **Success Processing** → Extract decoded text → Create check-in record
5. **Failure Handling** → Console logging (no UI feedback)

### 3. 5-Digit Code Entry Flow

1. **Keypad Input** → Individual digit/button presses (0-9)
2. **Input Logic**:
   - Numbers: Append to input string (max 5 digits)
   - Backspace: Remove last character
   - Clear: Reset input completely
3. **Validation** → Exactly 5 digits + member lookup via Django API
4. **Member Confirmation** → Display member details for usher verification
5. **Submission** → Create check-in record with "5-Digit Code" method

### 4. Smart Search Flow

1. **Text Input** → Real-time search query updates
2. **Search Trigger** → Button click or Enter key press
3. **Data Source** → Static `mockMembers` array
4. **Filtering** → Case-insensitive name matching
5. **Results Display** → Member cards with check-in buttons
6. **Check-in** → Create record with "Smart Search" method + member details

### 5. Common Check-in Processing

```javascript
const checkIn = {
  method: 'QR Scan' | 'BOL-Key Entry' | 'Smart Search',
  key: decodedText | bolKeyInput | member.name,
  time: now.toLocaleTimeString(),
  timestamp: now.getTime(),
  // Additional fields for search method
  name: member.name,
  area: member.area,
  parent: member.parent
};
```

### 6. Undo System

1. **Activation** → Automatic after each check-in (5-second window)
2. **Visual Cue** → Floating undo button (bottom-right corner)
3. **Execution** → Timestamp-based record removal
4. **Cleanup** → State reset + localStorage update

## Data Structures

### Check-in Record Format

```javascript
// QR Scan / BOL-Key Entry
{
  method: "QR Scan" | "BOL-Key Entry",
  key: string, // QR content or BOL-key
  time: string, // HH:MM:SS AM/PM format
  timestamp: number // Unix timestamp
}

// Smart Search
{
  method: "Smart Search",
  name: string, // Member full name
  area: string, // Member area
  parent: string, // Parent name
  time: string,
  timestamp: number
}
```

### Mock Members Data

```javascript
const mockMembers = [
  {
    id: number,
    name: string,
    area: string,
    parent: string,
    birthYear: string
  }
];
```

## Key Behaviors

### Input Validation
- **5-Digit Code**: Must be exactly 5 digits + member lookup via Django API
- **Search**: No validation, allows empty searches
- **QR Scan**: Format validation + member lookup via Django API

### Timing & Feedback
- **Success Overlay**: 3 seconds display
- **Undo Window**: 5 seconds availability
- **Camera Timeout**: No explicit timeout (continuous scanning)

### Error Handling
- **Scan Failures**: Console warnings only
- **Camera Access**: Basic try/catch with state reset
- **Input Errors**: No explicit error states shown to user

### Data Persistence
- **Scope**: Only `attendanceLog` array is persisted
- **Format**: JSON stringified array
- **Recovery**: Automatic load on component mount
- **Updates**: Synchronous saves on every check-in

## Limitations & Considerations

### Current Implementation
- **No Duplicate Prevention**: Multiple check-ins for same person allowed
- **No Business Rules**: No time restrictions or validation rules
- **Static Data**: Search depends on hardcoded member array
- **No Real-time Sync**: Data only local to device/browser
- **No Admin Integration**: Attendance data not visible to admins

### Performance Considerations
- **Memory Usage**: Attendance log grows indefinitely
- **LocalStorage Limits**: 5-10MB browser storage limits
- **Search Performance**: Linear search through mock data
- **Camera Resources**: Continuous camera access during scanning

### Security Considerations
- **No Authentication**: Any user can access usher terminal
- **Data Privacy**: Attendance logs stored in plain localStorage
- **Input Sanitization**: No sanitization of QR codes or search input

## Django Backend Integration

### API Endpoints
- `GET /api/members/by-code/{code}/` - Lookup member by 5-digit code
- `POST /api/attendance/check-in/` - Record attendance check-in
- `GET /api/members/search/?q={query}` - Search members by name
- `GET /api/attendance/recent/` - Get recent attendance records

### Data Synchronization
- Real-time attendance logging to Django database
- Member data fetched from central Django models
- Offline queue for attendance when network unavailable
- Sync on reconnection with conflict resolution

## Future Enhancements

### Backend Integration
- Django REST Framework for API endpoints
- Real-time synchronization with admin dashboard
- Member data from central PostgreSQL database
- JWT authentication and authorization

### Advanced Features
- Duplicate check-in prevention
- Time-based attendance rules
- Bulk import/export capabilities
- Attendance analytics and reporting
- Multi-device synchronization

### User Experience
- Better error handling and user feedback
- Offline capability with sync on reconnect
- Progressive Web App features
- Accessibility improvements

---

**This documentation covers the Usher Terminal's data flow as implemented in the current version of BOL-TAS.**