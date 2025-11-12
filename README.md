# GreenScape Lawn Care - Frontend

Modern, responsive React frontend for the GreenScape Lawn Care management system.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Headless UI, Heroicons
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Payments:** Stripe Elements
- **Notifications:** React Hot Toast
- **Error Handling:** React ErrorBoundary
- **Production Server:** Nginx (Docker)
- **Containerization:** Docker

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see `../lawn-care-backend`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - Backend API URL
   - Stripe publishable key (test mode)
   - Google Maps API key
   - Other API keys as needed

4. Start development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx           # Main navigation
│   │   ├── Footer.jsx           # Footer component
│   │   ├── ErrorBoundary.jsx    # Error boundary wrapper
│   │   └── LoadingSpinner.jsx   # Loading states
│   ├── customer/               # Customer portal components
│   ├── admin/
│   │   ├── CustomerManagement.jsx
│   │   ├── CustomerDetailModal.jsx
│   │   ├── ServicePackageManager.jsx
│   │   ├── AddOnServiceManager.jsx
│   │   ├── CrewManagement.jsx
│   │   └── ...
│   └── booking/                # Booking flow components
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CustomerPortal.jsx
│   ├── AdminPanel.jsx
│   ├── CustomerManagement.jsx
│   ├── Settings.jsx
│   └── ...
├── services/
│   ├── api.js                  # Axios instance with interceptors
│   ├── authService.js
│   ├── appointmentService.js
│   ├── dashboardService.js
│   └── ...
├── hooks/                      # Custom React hooks
├── context/
│   └── AuthContext.jsx         # Authentication context
├── utils/                      # Utility functions
├── App.jsx                     # Main app with routing + ErrorBoundary
├── main.jsx                    # Entry point with QueryClient
└── index.css                   # Global styles with Tailwind
```

## Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Docker Deployment

### Using Docker Compose (Recommended)

Run the entire stack from the project root:

```bash
cd /path/to/project/root
docker-compose up -d
```

The frontend will be available at `http://localhost` (port 80).

### Frontend Only with Docker

Build and run the frontend container:

```bash
docker build -t greenscape-frontend .
docker run -p 80:80 greenscape-frontend
```

The Dockerfile uses a multi-stage build:
1. **Build stage:** Uses Node 20 to install dependencies and build the Vite app
2. **Production stage:** Serves the built static files with Nginx

### Nginx Configuration

The production build uses Nginx with:
- **SPA routing:** All routes fallback to `index.html`
- **Gzip compression:** Enabled for text assets
- **Security headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Cache control:** Long-term caching for assets, no-cache for HTML

See `nginx.conf` for full configuration.

### Environment Variables

Build-time environment variables (set in `.env`):
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

Note: Vite requires `VITE_` prefix for environment variables to be exposed to the frontend.

## Features (By Phase)

### Phase 1-2 (Setup & Authentication)
- ✅ Project setup with Vite and React
- ✅ Tailwind CSS configured with green/earth tone theme
- ✅ React Router setup with protected routes
- ✅ Basic layout (Navbar, Footer)
- ✅ Axios configuration with interceptors
- ✅ React Query setup
- ✅ Authentication pages (Login, Register)
- ✅ JWT token management

### Phase 5 (Homepage)
- ✅ Hero section with CTA
- ✅ Service packages display
- ✅ Before/after gallery
- ✅ Customer testimonials
- ✅ Interactive quote calculator

### Phase 6 (Booking System)
- ✅ Multi-step booking form
- ✅ Google Maps integration for address
- ✅ Stripe payment processing
- ✅ Booking confirmation page

### Phase 7 (Customer Portal)
- ✅ Customer dashboard with metrics
- ✅ Appointment history with filtering
- ✅ Payment history and invoices
- ✅ Profile management
- ✅ Referral program

### Phase 8-9 (Admin Dashboard & Calendar)
- ✅ Admin dashboard with real-time analytics
- ✅ Revenue charts (Recharts)
- ✅ Today's appointments widget
- ✅ Customer metrics
- ✅ Full calendar view with drag-and-drop
- ✅ Appointment status management

### Phase 10 (Admin Customer Management)
- ✅ Customer list with search and filters
- ✅ Customer detail modal with tabs
- ✅ Customer form for create/edit
- ✅ CSV export functionality
- ✅ Communication notes tracking
- ✅ Customer status management (active/paused/archived)

### Phase 11 (Service & Settings Management)
- ✅ Service package manager (CRUD)
- ✅ Add-on service manager (CRUD)
- ✅ Crew member management (CRUD)
- ✅ Tabbed settings interface
- ✅ Business settings configuration

### Phase 12 (Reviews, Quotes & Referrals - Backend Complete)
- ✅ Quote submission backend
- ✅ Review system backend
- ✅ Referral tracking backend
- ⏳ Frontend components (deferred)

### Phase 13 (Production Ready)
- ✅ ErrorBoundary for graceful error handling
- ✅ Docker configuration for deployment
- ✅ Nginx configuration for production
- ✅ Health checks
- ✅ Comprehensive documentation

## Color Palette

The application uses a green/earth tone color scheme:
- **Primary Green:** #22c55e (green-500)
- **Earth Tones:** Brown/tan shades
- **Accent:** Yellow/gold tones

See `tailwind.config.js` for the complete color system.

## Environment Variables

See `.env.example` for all required environment variables.

## Backend Connection

This frontend connects to the Express API backend. Make sure the backend is running on the URL specified in `VITE_API_URL` (default: `http://localhost:5000/api`).

## Development Progress

Track development progress in `PROGRESS.md` at the project root.

## License

MIT
# lawn-care-demo
