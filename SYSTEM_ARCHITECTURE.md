# BOL-TAS System Architecture

## System Overview

BOL-TAS is a church management application built as a modern React single-page application with role-based access control. It serves three main user types: administrators, teens, and ushers, providing secure attendance tracking, member management, and administrative tools.

## High-Level Architecture

```mermaid
graph TB
     A[User] --> B{Browser}
     B --> C[Vite Dev Server]
     C --> D[React SPA]

     D --> E[React Router]
     E --> F[Role-Based Routes]

     F --> G[Admin Module]
     F --> H[Teen Module]
     F --> I[Usher Module]
     F --> J[Auth Module]

     G --> G1[Dashboard]
     G --> G2[Statistics]
     G --> G3[Members Mgmt]
     G --> G4[Attendance]
     G --> G5[Ushers Mgmt]
     G --> G6[Shepherding]

     H --> H1[Teen Portal]
     H --> H2[Profile Edit]
     H --> H3[Security/Recovery]

     I --> I1[Usher Terminal]
     I --> I2[QR Scanning]
     I --> I3[Search]
     I --> I4[BOL Key Mgmt]

     J --> J1[Login]
     J --> J2[Create Account]

     D --> K[Redux Store]
     D --> L[Firebase Services]
     L --> M[Firestore DB]
     L --> N[Firebase Auth]

     D --> O[UI Components]
     O --> P[Radix UI]
     O --> Q[Tailwind CSS]
     O --> R[Custom Components]

     D --> S[Utilities]
     S --> T[Helpers]
     S --> U[QR Code Utils]
```

## Data Flow Architecture

### Authentication & Session Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant LS as localStorage
    participant A as App.jsx
    participant R as Router

    U->>B: Access application
    B->>LS: Check for userAccount
    LS-->>B: Return session data
    B->>A: Initialize with session
    A->>R: Route based on role
    R->>U: Render appropriate module

    Note over U,R: Role-based access control enforced
```

### Attendance Processing Flow

```mermaid
graph TD
    A[Member Approaches Usher] --> B{Check-in Method}
    B -->|QR Code| C[Show QR Code]
    B -->|BOL Key| D[Provide 5-digit code]
    B -->|Smart Search| E[Give name/details]

    C --> F[Usher scans QR]
    D --> G[Usher enters code]
    E --> H[Usher searches member]

    F --> I[QR validation]
    G --> J[Code lookup]
    H --> K[Member selection]

    I --> L{Valid QR?}
    J --> M{Code exists?}
    K --> N{Member found?}

    L -->|No| O[Error: Invalid QR]
    M -->|No| P[Error: Code not found]
    N -->|No| Q[Error: Member not found]

    L -->|Yes| R[Extract member data]
    M -->|Yes| S[Retrieve member data]
    N -->|Yes| T[Use selected member]

    R --> U[Confirm attendance]
    S --> U
    T --> U

    U --> V{Usher confirms?}
    V -->|No| W[Cancel check-in]
    V -->|Yes| X[Log attendance]
    X --> Y[Save to localStorage]
    Y --> Z[Show success]
```

## Key Architectural Components

### **Frontend Framework**
- **React 18** with modern hooks and concurrent features
- **Vite** for fast development and building
- **React Router DOM** for client-side routing

### **State Management**
- **Redux Toolkit** for global state management
- Local storage for user session persistence
- Custom events for cross-tab synchronization

### **Backend Services**
- **Firebase Firestore** for data storage
- **Firebase Authentication** for user management
- Environment-based configuration

### **UI/UX Layer**
- **Tailwind CSS** for utility-first styling
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization

### **Role-Based Architecture**
The application implements strict role-based routing:

- **Admin Role**: Full administrative dashboard with comprehensive management features
- **Teen Role**: Limited portal for profile management and security settings  
- **Usher Role**: Specialized terminal for church ushering operations (QR scanning, attendance tracking)

### **Modular Structure**
```
src/
├── components/          # Shared UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── shared/ui/      # Reusable UI primitives
├── modules/            # Feature modules by role
│   ├── admin/          # Admin-specific features
│   ├── teen/           # Teen portal features
│   └── usher/          # Usher terminal features
├── firebase/           # Backend service integration
├── utils/              # Helper functions
└── assets/             # Static assets
```

### **Key Features**
- QR code generation and scanning for attendance
- Real-time data synchronization via Firebase
- Responsive design with mobile-first approach
- Progressive Web App capabilities
- Secure authentication with role-based access

This architecture provides a scalable, maintainable foundation for church management operations with clear separation of concerns and role-based functionality.