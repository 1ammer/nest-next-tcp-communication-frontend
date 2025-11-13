# Task Assessment Frontend - Next.js 14

Modern, responsive user management application built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- ✅ User Registration with form validation
- ✅ User List with responsive table/card layout
- ✅ Reusable UI Component Library (Button, Card, InputField, Modal, Tabs)
- ✅ Dark Mode Support
- ✅ Fully Responsive Design
- ✅ Loading and Error States
- ✅ TypeScript for Type Safety
- ✅ ESLint + Prettier Configuration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

## Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

The application will be available at `http://localhost:3001`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── register/          # User registration page
│   ├── users/             # Users list page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── InputField.tsx
│   │   ├── Modal.tsx
│   │   └── Tabs.tsx
│   ├── RegisterForm.tsx  # Registration form
│   ├── UserList.tsx      # Users list component
│   ├── Navbar.tsx        # Navigation bar
│   └── ThemeToggle.tsx   # Dark mode toggle
├── lib/                  # Utility functions
│   ├── api.ts           # Axios configuration
│   └── utils.ts         # Helper functions
├── services/            # API services
│   └── auth.service.ts  # Auth API calls
└── types/               # TypeScript types
    └── index.ts
```

## UI Component Library

### Button
Supports variants (primary, secondary, outline, danger), sizes (sm, md, lg), loading state, and accessibility.

### Card
Flexible card component with variants (default, bordered, elevated) and customizable padding.

### InputField
Form input with label, error messages, helper text, and validation states.

### Modal
Accessible modal dialog with backdrop, keyboard navigation (ESC to close), and customizable sizes.

### Tabs
Tabbed interface with two variants (default, pills) and full-width option.

## API Integration

The frontend integrates with these backend endpoints:

- `POST /auth/register` - Register new user
- `GET /auth/users` - Get all users

## Features Implemented

### Registration Page
- Form validation (email format, password length, required fields)
- Real-time error feedback
- Success modal on registration
- Loading states
- API error handling

### Users Page
- Responsive table (desktop) and card layout (mobile)
- Auto-fetch on mount
- Manual refresh button
- Loading spinner
- Empty state handling
- Error state with retry

### Dark Mode
- System preference detection
- Manual toggle
- Persistent theme storage

## Deployment

This project is ready to deploy on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT