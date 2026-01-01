# BOL-TAS React Frontend Specifications

## Overview

This document provides comprehensive specifications for the BOL-TAS React frontend application. The frontend is a modern single-page application built with React 18, featuring role-based access control, real-time updates, and responsive design for church attendance management.

## Architecture Overview

### Technology Stack

- **Framework**: React 18 with modern hooks and concurrent features
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router DOM v6 with protected routes
- **State Management**: Redux Toolkit with RTK Query for API state
- **UI Framework**: Radix UI primitives with Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for form management
- **QR Codes**: qrcode library for generation and html5-qrcode for scanning
- **Real-time**: WebSocket support for live updates

### Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── layout/             # Layout components (AdminLayout, Sidebar)
│   └── shared/             # Shared UI primitives
│       └── ui/            # Radix UI components
├── modules/                # Feature modules by role
│   ├── admin/              # Admin-specific features
│   │   ├── components/     # Admin components
│   │   └── hooks/         # Admin-specific hooks
│   ├── teen/               # Teen portal features
│   └── usher/              # Usher terminal features
├── services/               # API service layer
│   ├── api.js             # RTK Query API definitions
│   ├── auth.js            # Authentication services
│   └── websocket.js       # WebSocket services
├── utils/                  # Utility functions
│   ├── constants.js       # Application constants
│   ├── helpers.js         # Helper functions
│   ├── database.js        # Mock database utilities
│   └── cn.js              # Class name utility
├── hooks/                  # Custom React hooks
├── store/                  # Redux store configuration
├── assets/                 # Static assets
└── App.jsx                 # Main application component
```

## Core Components

### Authentication Components

#### Login Component (`src/components/auth/Login.jsx`)

**Purpose**: User authentication with role-based redirection
**Features**:
- Email/password login form
- Form validation with error display
- Loading states and error handling
- Backend-driven role verification
- Automatic role-based redirect after successful login
- Church-appropriate messaging

**State Management**:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

**API Integration**:
- Uses `useLoginMutation` from RTK Query
- Stores JWT tokens in localStorage
- Dispatches `userLoggedIn` event for app-wide state updates
- Role-based redirection:
  - Admins → Admin dashboard (`/`)
  - Temp ushers → Usher terminal (`/`)
  - Teens/members → Teen portal (`/`)

#### CreateAccount Component (`src/components/auth/CreateAccount.jsx`)

**Purpose**: Streamlined member registration for church community
**Features**:
- Clean, member-focused registration form
- Automatic role assignment (teen/member)
- Form validation and error handling
- Password confirmation
- Success confirmation and auto-login
- Church-appropriate messaging

**Form Fields**:
- Full name
- Email address
- Password (with strength indicator)
- Confirm password

**Key Changes**:
- Removed role selection UI elements
- Default role assignment to 'teen' for all new members
- Streamlined interface focused on church membership
- Role management handled exclusively through admin backend

### Layout Components

#### AdminLayout (`src/components/layout/AdminLayout.jsx`)

**Purpose**: Main layout for admin dashboard
**Features**:
- Responsive sidebar navigation
- Top navigation bar with user menu
- Breadcrumb navigation
- Mobile-responsive design
- Role-based menu items

**Navigation Structure**:
```javascript
const navItems = [
  { name: 'Overview', href: '/overview', icon: LayoutGrid },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Calendar },
  { name: 'Ushers', href: '/ushers', icon: UserCheck },
  { name: 'Shepherding', href: '/shepherding', icon: List },
];
```

#### Sidebar Component (`src/components/layout/Sidebar.jsx`)

**Purpose**: Collapsible navigation sidebar
**Features**:
- Collapsible/expandable design
- Role-based menu filtering
- Logout functionality
- Active route highlighting
- Mobile overlay support

### Role-Based Modules

#### Admin Module

**Dashboard Components**:
- **AdminMain**: Overview dashboard with key metrics
- **StatisticsPage**: Charts and analytics
- **MembersPage**: Member management with CRUD operations
- **AttendancePage**: Attendance records and reporting
- **UshersPage**: Usher assignment management
- **ShepherdingPage**: Pastoral care tracking

**Key Features**:
- Bulk operations for attendance records
- Advanced filtering and search
- Export functionality (CSV/PDF)
- Real-time statistics updates

#### Teen Module

**Portal Components**:
- **TeenPortal**: Main teen interface with tabbed navigation
- **IdTab**: Personal ID card with QR code
- **AttendanceTab**: Personal attendance history
- **SecurityTab**: Security settings and recovery
- **EditProfile**: Profile editing interface

**Key Features**:
- QR code generation for attendance
- Personal attendance tracking
- Profile photo upload
- Security question setup
- Account recovery options

#### Usher Module

**Terminal Components**:
- **UsherTerminal**: Main usher interface
- **QRScanTab**: QR code scanning functionality
- **BOLKeyTab**: Manual code entry
- **SearchTab**: Member search and selection
- **SuccessOverlay**: Check-in confirmation

**Key Features**:
- Real-time QR code scanning
- Multiple check-in methods
- Attendance logging with undo functionality
- Location-based filtering
- Performance tracking

## State Management

### Redux Store Configuration

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { boltasApi } from './services/api';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [boltasApi.reducerPath]: boltasApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(boltasApi.middleware),
});

setupListeners(store.dispatch);
```

### RTK Query API Configuration

```javascript
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// JWT token management
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const boltasApi = createApi({
  reducerPath: 'boltasApi',
  baseQuery,
  tagTypes: ['User', 'Attendance', 'UsherAssignment', 'Shepherding'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/token/',
        method: 'POST',
        body: credentials,
      }),
    }),

    // User management
    getUsers: builder.query({
      query: () => '/users/',
      providesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}/`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Attendance
    getAttendance: builder.query({
      query: (params) => ({
        url: '/attendance/',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    createAttendance: builder.mutation({
      query: (attendance) => ({
        url: '/attendance/',
        method: 'POST',
        body: attendance,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Usher assignments
    getUsherAssignments: builder.query({
      query: (params) => ({
        url: '/usher-assignments/',
        params,
      }),
      providesTags: ['UsherAssignment'],
    }),

    createUsherAssignment: builder.mutation({
      query: (assignment) => ({
        url: '/usher-assignments/',
        method: 'POST',
        body: assignment,
      }),
      invalidatesTags: ['UsherAssignment'],
    }),
  }),
});
```

### Authentication State Management

```javascript
// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

## Routing Configuration

### App.jsx Routing Structure

```javascript
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from './components/layout/AdminLayout';
import TeenPortal from './modules/teen/components/TeenPortal';
import UsherTerminal from './modules/usher/components/UsherTerminal';
import Login from './components/auth/Login';
import CreateAccount from './components/auth/CreateAccount';

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/create-account"
          element={!isAuthenticated ? <CreateAccount /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            {/* Admin Routes */}
            {user?.role === 'admin' && (
              <>
                <Route path="/" element={<AdminLayout><AdminMain /></AdminLayout>} />
                <Route path="/statistics" element={<AdminLayout><StatisticsPage /></AdminLayout>} />
                <Route path="/members" element={<AdminLayout><MembersPage /></AdminLayout>} />
                <Route path="/attendance" element={<AdminLayout><AttendancePage /></AdminLayout>} />
                <Route path="/ushers" element={<AdminLayout><UshersPage /></AdminLayout>} />
                <Route path="/shepherding" element={<AdminLayout><ShepherdingPage /></AdminLayout>} />
              </>
            )}

            {/* Teen Routes */}
            {user?.role === 'teen' && (
              <>
                <Route path="/" element={<TeenPortal />} />
                <Route path="/edit-profile" element={<EditProfile />} />
              </>
            )}

            {/* Usher Routes */}
            {(user?.role === 'usher' || user?.role === 'temp_usher') && (
              <Route path="/" element={<UsherTerminal />} />
            )}
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Component Specifications

### Admin Dashboard Components

#### AdminMain Component

**Purpose**: Main admin dashboard with key metrics and recent activity
**Features**:
- Real-time statistics cards
- Recent attendance records
- Active usher assignments
- Quick actions panel
- Charts for attendance trends

**Data Requirements**:
- Total members count
- Today's attendance
- Active ushers
- Recent check-ins
- Weekly attendance data

#### MembersPage Component

**Purpose**: Comprehensive member management interface
**Features**:
- Member list with search and filtering
- Add/edit/delete member functionality
- Bulk operations
- Export capabilities
- Role management

**State Management**:
```javascript
const [members, setMembers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedLocation, setSelectedLocation] = useState('');
const [showAddModal, setShowAddModal] = useState(false);
const [editingMember, setEditingMember] = useState(null);
```

### Teen Portal Components

#### TeenPortal Component

**Purpose**: Main interface for teen users
**Features**:
- Tabbed navigation (ID Card, Security, Recovery, Attendance)
- Side drawer with additional options
- Usher duty activation (when assigned)
- Profile editing access
- Logout functionality

**Navigation Tabs**:
- **ID Card**: Personal QR code and information
- **Security**: Password and security settings
- **Recovery**: Account recovery options
- **Attendance**: Personal attendance history

#### IdTab Component

**Purpose**: Personal ID card with QR code generation
**Features**:
- QR code generation from personal code
- Profile photo display
- Personal information display
- Download/share options

**QR Code Generation**:
```javascript
useEffect(() => {
  const generateQR = async (text) => {
    try {
      const qr = await QRCode.toString(text, { type: 'svg', width: 300 });
      setQrCode(qr);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  if (personalCode) {
    generateQR(personalCode);
  }
}, [personalCode]);
```

### Usher Terminal Components

#### UsherTerminal Component

**Purpose**: Main usher check-in interface
**Features**:
- Tabbed interface (QR Scan, BOL Key, Search)
- Real-time attendance logging
- Success/error feedback
- Undo functionality
- Session management

**State Management**:
```javascript
const [activeTab, setActiveTab] = useState('qr');
const [scanResult, setScanResult] = useState('');
const [bolKeyInput, setBolKeyInput] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [attendanceLog, setAttendanceLog] = useState([]);
const [lastCheckIn, setLastCheckIn] = useState(null);
const [showUndo, setShowUndo] = useState(false);
```

#### QRScanTab Component

**Purpose**: QR code scanning functionality
**Features**:
- Camera access and QR scanning
- Real-time video feed
- Scan result validation
- Error handling and retry options

**QR Scanner Implementation**:
```javascript
useEffect(() => {
  const startScanning = () => {
    if (!scannerInstance.current && videoRef.current) {
      scannerInstance.current = new Html5QrcodeScanner(
        videoRef.current.id,
        {
          fps: 30,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerInstance.current.render(
        onScanSuccess,
        onScanFailure
      );
    }
  };

  startScanning();

  return () => {
    if (scannerInstance.current) {
      scannerInstance.current.clear();
    }
  };
}, []);
```

## Custom Hooks

### Authentication Hook

```javascript
// hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
    // Additional cleanup if needed
  };

  return {
    user,
    token,
    isAuthenticated,
    logout,
  };
};
```

### API Hooks

```javascript
// hooks/useAttendance.js
import { useGetAttendanceQuery, useCreateAttendanceMutation } from '../services/api';

export const useAttendance = (filters = {}) => {
  const { data, isLoading, error, refetch } = useGetAttendanceQuery(filters);
  const [createAttendance, { isLoading: isCreating }] = useCreateAttendanceMutation();

  const checkIn = async (attendanceData) => {
    try {
      const result = await createAttendance(attendanceData).unwrap();
      refetch(); // Refresh the list
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    attendance: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    checkIn,
    isCreating,
    refetch,
  };
};
```

## Utility Functions

### Constants (`src/utils/constants.js`)

```javascript
export const USER_ROLES = {
  TEEN: 'teen',
  ADMIN: 'admin',
  USHER: 'usher',
  TEMP_USHER: 'temp_usher',
};

export const ATTENDANCE_METHODS = {
  QR_SCAN: 'qr_scan',
  BOL_KEY: 'bol_key',
  SMART_SEARCH: 'smart_search',
  MANUAL: 'manual',
};

export const LOCATIONS = [
  'Main Campus',
  'Downtown Branch',
  'Riverside Campus',
  'Hillcrest Center',
  'East Legon',
  'Cantonments',
  'Tema',
  'Accra Central',
  'Takoradi',
  'Kumasi',
];

export const PERMISSION_LEVELS = [
  { value: 'standard', label: 'Standard - Can scan QR codes and process check-ins' },
  { value: 'lead', label: 'Lead - Can manage check-ins and view reports' },
  { value: 'senior', label: 'Senior - Full access including usher management' },
];
```

### Helper Functions (`src/utils/helpers.js`)

```javascript
// Date formatting
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Attendance calculations
export const calculateAttendanceStreak = (user) => {
  // Calculate current attendance streak
  // Implementation depends on attendance records
};

export const getAttendancePercentage = (user) => {
  // Calculate attendance percentage
  // Implementation depends on attendance records
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

// QR Code utilities
export const generatePersonalCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const validatePersonalCode = (code) => {
  return /^\d{5}$/.test(code);
};
```

## Real-time Features

### WebSocket Integration

```javascript
// services/websocket.js
class AttendanceWebSocket {
  constructor(location) {
    this.location = location;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/ws/attendance/${this.location}/?token=${token}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleMessage(data) {
    // Handle incoming attendance updates
    if (data.type === 'attendance_update') {
      // Dispatch to Redux store or trigger local updates
      window.dispatchEvent(new CustomEvent('attendanceUpdate', {
        detail: data.data
      }));
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default AttendanceWebSocket;
```

## Testing Strategy

### Component Testing

```javascript
// __tests__/components/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Login from '../../components/auth/Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

### API Testing

```javascript
// __tests__/services/api.test.js
import { boltasApi } from '../../services/api';
import { store } from '../../store';

describe('BOL-TAS API', () => {
  test('login endpoint', async () => {
    const result = await store.dispatch(
      boltasApi.endpoints.login.initiate({
        email: 'test@example.com',
        password: 'password123'
      })
    );

    expect(result.data).toHaveProperty('access');
    expect(result.data).toHaveProperty('refresh');
  });

  test('get users endpoint', async () => {
    const result = await store.dispatch(
      boltasApi.endpoints.getUsers.initiate()
    );

    expect(Array.isArray(result.data.results)).toBe(true);
  });
});
```

## Performance Optimization

### Code Splitting

```javascript
// App.jsx - Route-based code splitting
import { lazy, Suspense } from 'react';

const AdminMain = lazy(() => import('./modules/admin/components/AdminMain'));
const TeenPortal = lazy(() => import('./modules/teen/components/TeenPortal'));
const UsherTerminal = lazy(() => import('./modules/usher/components/UsherTerminal'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/teen" element={<TeenPortal />} />
          <Route path="/usher" element={<UsherTerminal />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Image Optimization

```javascript
// components/shared/ImageOptimizer.jsx
import { useState, useEffect } from 'react';

const ImageOptimizer = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageSrc('/placeholder-image.jpg');
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 rounded" style={{ width: '100%', height: '200px' }} />;
  }

  return <img src={imageSrc} alt={alt} className={className} {...props} />;
};

export default ImageOptimizer;
```

## Deployment Configuration

### Environment Variables

```javascript
// .env.example
REACT_APP_API_URL=https://api.boltas.com/api
REACT_APP_WS_URL=wss://api.boltas.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

## Security Considerations

### Authentication Security

- JWT tokens stored securely in httpOnly cookies (recommended)
- Automatic token refresh
- Secure logout with token blacklisting
- CSRF protection for forms

### Data Protection

- Input sanitization and validation
- XSS prevention with React's built-in protection
- Content Security Policy headers
- Secure file upload handling

### API Security

- Rate limiting on API calls
- Request/response encryption
- Error message sanitization
- CORS configuration

This comprehensive React frontend specification provides the complete architecture, components, and implementation details for the BOL-TAS church management application.</content>
</xai:function_call">The React frontend specifications have been created in `REACT_FRONTEND_SPECS.md`. This comprehensive document covers:

## Key Specification Areas:

### **Technology Stack & Architecture**
- Complete tech stack with React 18, Vite, Redux Toolkit, RTK Query
- Project structure and file organization
- State management with Redux and RTK Query
- Routing configuration with React Router

### **Core Components**
- **Authentication**: Login and CreateAccount components with form validation
- **Layout**: AdminLayout and Sidebar with responsive design
- **Role-based Modules**: Admin, Teen, and Usher feature sets

### **State Management**
- Redux store configuration
- RTK Query API integration
- Authentication state management
- Tag-based caching for efficient data fetching

### **Component Specifications**
- **Admin Module**: Dashboard, statistics, member management, attendance tracking
- **Teen Module**: Portal with ID cards, attendance history, profile editing
- **Usher Module**: Terminal with QR scanning, BOL key entry, search functionality

### **Custom Hooks & Utilities**
- Authentication hooks
- API integration hooks
- Helper functions for validation, formatting, QR codes
- Constants and configuration

### **Real-time Features**
- WebSocket integration for live attendance updates
- Event-driven architecture for cross-component communication

### **Testing Strategy**
- Component testing with React Testing Library
- API testing with RTK Query
- Test utilities and mocking

### **Performance Optimization**
- Code splitting with lazy loading
- Image optimization
- Build configuration for production

### **Security & Deployment**
- Authentication security measures
- Data protection practices
- Environment configuration
- Build optimization

The specifications provide a complete blueprint for implementing and maintaining the React frontend, ensuring consistency, scalability, and maintainability.