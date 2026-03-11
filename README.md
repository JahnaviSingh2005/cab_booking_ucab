# Ucab - Full Stack Cab Booking Web App
This is the MERN stack cab booking application.

## Folder Structure
```
d:\cab_booking\
|-- /client  (React frontend - Vite)
|-- /server  (Node.js backend)
      |-- /models
      |-- /routes
      |-- /controllers
      |-- /middleware
      |-- /config
```

## Setup Instructions

### Backend (Server)
1. Open terminal and navigate to server directory: `cd server`
2. Configure `.env` using `.env.example`
3. Start MongoDB locally (or set `MONGO_URI` to a cluster).
4. Run server: `npm run dev` (we installed nodemon, just add script to package.json)

### Frontend (Client)
1. Open a new terminal and navigate to client directory: `cd client`
2. Install dependecies if not done already: `npm install`
3. Run dev server: `npm run dev`

## Implemented
- Scaffolded project directories for MERN stack using Vite/React and Express.
- Setup MongoDB configurations and initialized Server.
- Configured models for Users, Drivers, Rides, and Payments.
- Wrote JWT verification middlewares to support role-based routing.
- Set up Socket.io connection boilerplate in server for live tracking.

## Next Steps
- Link all Express Routes and Controllers for Authentication, Rides, and Payments.
- Complete React Components (Auth pages, Map, Dashboards).
