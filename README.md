# POTENTIAL Frontend

## Project Architecture

### **Frontend-Only Implementation**
This repository contains **only the frontend React application**. 

### **User Types**
1. **Farmers**: Simplified dashboard focused on field monitoring and AI recommendations
2. **System Administrators**: Comprehensive management interface with system configuration and monitoring tools

## Technology Stack

- **React 19.1.1** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **TailwindCSS 3.4.17** - Utility-first CSS framework  
- **React Router DOM 6.30.1** - Client-side routing
- **RemixIcon 4.6.0** - Comprehensive icon library
- **JavaScript** - Pure JavaScript implementation (no TypeScript)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components
│   │   ├── Header.jsx   # Top navigation bar
│   │   ├── Sidebar.jsx  # User navigation menu
│   │   ├── AdminSidebar.jsx  # Admin navigation menu
│   │   └── DashboardLayout.jsx
│   ├── ui/              # Base UI components
│   │   ├── Button.jsx   # Reusable button component
│   │   ├── Input.jsx    # Form input component
│   │   ├── Checkbox.jsx # Custom checkbox
│   │   └── LoadingSpinner.jsx
│   └── ErrorBoundary.jsx # React error boundary for error catching
├── pages/               # Route components
│   ├── Login.jsx        # Authentication page
│   ├── DeviceSelection.jsx  # Device/field selection
│   ├── UserDashboard.jsx    # Farmer interface
│   └── AdminDashboard.jsx   # Admin interface
├── hooks/               # Custom React hooks
│   ├── useNavigation.js # Navigation utilities
│   ├── useToggle.js     # Toggle state hook
│   └── useLoadingState.js # Professional loading state management
├── services/            # API and external services
│   ├── api.js          # API client configuration
│   ├── auth.js         # Authentication services
│   └── aws-config.js   # AWS configuration
├── utils/               # Utility functions
│   ├── logger.js        # Structured logging system
│   ├── errors.js        # Custom error classes
│   └── errorHandler.js  # Centralized error handling
└── data/                # Configuration data
    └── menuConfig.js    # Navigation menu configuration
```

## Design System

### **Color Palette**
- **Primary**: `#4CAF50` (Agriculture Green)
- **Secondary**: `#81C784` (Light Green)
- **Success**: `#24a148`
- **Warning**: `#f1c21b`
- **Error**: `#da1e28`

### **Typography**
- **System Fonts** for general UI
- **Pacifico** for logo and branding

### **Icons**
- **RemixIcon** library for consistent iconography

## Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd potential-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Development**
```bash
npm run dev        # Start development server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Development Guidelines

### **Code Standards**
- **Functional Components** with React hooks
- **Clean, modular** component architecture
- **TailwindCSS** for all styling (no custom CSS)
- **Accessibility features** built-in
- **Consistent naming** conventions (camelCase variables, PascalCase components)

### **Component Pattern**
```jsx
// Example component structure
const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue)
  
  const handleEvent = () => {
    // Event handling logic
  }
  
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### **Navigation Structure**
- **React Router** for client-side routing
- **Custom hooks** for navigation utilities
- **State management** via React hooks (no external state library)

## Available Routes

- `/` - Login page
- `/devices` - Device/field selection
- `/dashboard/user` - Farmer dashboard
- `/dashboard/admin` - Administrator dashboard

## Future Enhancements

The project roadmap includes:
- **Accessibility improvements** (WCAG 2.1 AA compliance)
- **Comprehensive testing** (Unit + Integration tests with error scenarios)
- **Performance optimization** (Code splitting, lazy loading)
- **Design system** (Component library)

