# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the courier frontend application for the DineDash food delivery system. It's a React + Vite application that provides a mobile-friendly interface for delivery drivers to manage their deliveries.

## Commands

```bash
# Install dependencies
npm install

# Development server (default port, or 5174 in Docker)
npm run dev

# Production build
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **React 19.0.0** with React Router DOM 7.4.0
- **Vite 6.2.0** for build tooling
- **Tailwind CSS 4.0.15** + **DaisyUI 5.0.9** for styling
- **Leaflet 1.9.4** and **React Leaflet 5.0.0** for maps
- **@react-google-maps/api 2.20.6** for Google Maps integration

### Application Structure

The app has two main pages:

1. **CourierDashboard** (`/`): Lists available and active deliveries
   - Auto-refreshes every 3 seconds
   - Allows accepting pending orders
   - Shows active delivery status
   - Handles logout with confirmation modal

2. **CourierOrder** (`/courier/order/:id`): Active delivery management
   - Shows delivery details (customer, restaurant, addresses)
   - Allows marking delivery as completed
   - Redirects to dashboard after completion

### Key Implementation Details

- **Authentication**: JWT tokens stored in localStorage
- **Active Delivery Tracking**: Uses cookies to track current delivery
- **API Integration**: Communicates with tracking service at `VITE_TRACKING_API`
- **Routing**: Uses React Router with base path `/courier`
- **Styling**: Tailwind CSS with DaisyUI semantic components

### Environment Variables

- `VITE_TRACKING_API`: Backend tracking service URL

### API Endpoints Used

- `GET /v1/deliveries` - Fetch all deliveries
- `GET /v1/deliveries/{id}` - Get specific delivery details
- `PATCH /v1/deliveries/{id}` - Update delivery status

### Development Workflow

1. **Adding new features**: Create components in `src/components/` or pages in `src/pages/`
2. **Styling**: Use Tailwind utility classes and DaisyUI components
3. **State Management**: Currently uses React hooks; consider context for shared state
4. **API Integration**: Use the existing pattern with fetch and JWT authorization headers