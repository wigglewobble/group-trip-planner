# TripNest

TripNest is an AI-powered collaborative travel planner that simplifies group trip organization. It enables users to create trips, invite members through secure shareable links, collect preferences, generate intelligent itineraries, share notes, and explore destinations through interactive maps.

## Features

* Secure invite-based collaboration
* Multi-user trip planning
* Shared trip notes
* AI-generated personalized itineraries
* Interactive maps with geocoded activities
* Weather-aware recommendations
* Global destination support
* Light and dark mode
* Secure authentication with Supabase
* Responsive design for desktop and mobile

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Leaflet

### Backend

* Node.js
* Express.js
* Prisma ORM

### Database and Authentication

* PostgreSQL (Supabase)
* Supabase Authentication

### AI and External APIs

* Gemini API
* Groq API
* Open-Meteo Weather API
* OpenStreetMap Nominatim Geocoding API

## Live Demo

Frontend:

https://tripnest-taupe.vercel.app

Backend:

https://tripnest-server-1zuo.onrender.com

## Screenshots

(Add screenshots here)

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/group-trip-planner.git
cd group-trip-planner
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

## Environment Variables

### Server

```env
DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENWEATHER_API_KEY=
FRONTEND_URL=
NODE_ENV=
```

### Client

```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Project Architecture

```
React + Vite
      ↓
Express.js + Node.js
      ↓
Prisma ORM
      ↓
PostgreSQL (Supabase)
      ↓
AI Services + Weather + Geocoding APIs
```

## Future Improvements

* Expense splitting
* Real-time collaboration
* Hotel and restaurant recommendations
* PDF itinerary export
* Notifications and reminders
* Budget planning
* Offline support

## License

This project is licensed under the MIT License.

## Author

Built by Abhranil Palit.
