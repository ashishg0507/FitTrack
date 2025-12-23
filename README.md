# FitLife Diet & Training Platform

Node + Express application that generates personalized nutrition plans, manages workout-focused profiles, and serves a multipage marketing site rendered with EJS templates.

## Features

- User registration, login, and logout backed by JWT cookies
- Profile management APIs that store biometrics, goals, and dietary preferences
- Nutrition calculator (BMR/TDEE) and auto-generated multi-day diet plans
- Dish catalog with swapping flow and seed script for demo data
- Responsive EJS pages for marketing, pricing, dashboard, and profile views

## Tech Stack

| Area | Tools |
| --- | --- |
| Runtime | Node.js (CommonJS) |
| Web framework | Express 5 |
| Views | EJS templates + vanilla JS / CSS assets |
| Database | MongoDB with Mongoose ODM |
| Auth & security | JSON Web Tokens, bcryptjs for hashing, cookie-parser |
| Sessions/cache | express-session (cookie-backed today, Redis-ready connectors) |
| Data seeding | Custom `server/seedDishes.js` script |

## Middleware & Auth Flow

- `express.urlencoded` / `express.json` handle form posts and API payloads.
- `cookie-parser` exposes cookies for JWT verification.
- `express-session` keeps legacy flash-style states; JWT drives primary auth.
- Static assets served from `server/assets` with fallback to project-level `assets`.
- Custom helpers in `server/server.js`:
  - `signJwt`, `verifyJwt`, `setAuthCookie`, `clearAuthCookie`.
  - `requireAuth` gatekeeps any route under `/profile`, `/diet`, `/api/*`, returning 401 JSON for API calls and redirecting for page hits.

## Data Models

- `User`: profile, measurements, nutrition goals, dietary preferences, notification toggles, and a reference to the current diet plan.
- `Dish`: nutrition facts, dietary tags, cuisine metadata, and restrictions to support filtering and swaps.
- `DietPlan`: multi-day plan storing dish references per meal with macro totals and user-defined preferences.

All schemas live under `server/models/` and use timestamps plus helpful indexes for lookup performance.

## Project Scripts

| Command | Description |
| --- | --- |
| `npm start` | Boot the Express server (`server/server.js`). |
| `npm run seed-dishes` | Populate Mongo with the curated dishes collection (`server/seedDishes.js`). |

## Environment Variables

| Name | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the Express app. |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/fittracker` | MongoDB connection string. |
| `SESSION_SECRET` | `dev_secret_change_me` | Secret for `express-session`. |
| `JWT_SECRET` | `dev_jwt_secret_change_me` | Secret for signing auth tokens. |
| `NODE_ENV` | `development` | Enables secure cookies when set to `production`. |

## Running Locally

1. Install dependencies  
   ```bash
   npm install
   ```
2. Run a MongoDB instance (local or hosted) and update `MONGO_URI` if needed.
3. Seed dishes (optional but recommended for diet plan generation)  
   ```bash
   npm run seed-dishes
   ```
4. Start the app  
   ```bash
   npm start
   ```
5. Visit `http://localhost:3000` to explore the marketing pages, then sign up to access the dashboard, profile, and diet planner.

## Directory Highlights

```
assets/               # Client-side JS/CSS used by EJS templates
server/
  assets/             # Server-served static bundle (mirrors /assets)
  models/             # User, Dish, DietPlan schemas
  views/              # EJS templates for auth, marketing, dashboard
  seedDishes.js       # Seeds Mongo with rich dish data
  server.js           # Express app, routes, middleware, and APIs
```

## What Lives Where

- `server/server.js`
  - Boots Express, registers JSON/urlencoded parsers, static asset handlers, and view engine.
  - Connects to MongoDB via `mongoose.connect(MONGO_URI)` and logs success/failure.
  - Implements JWT utilities (`signJwt`, `verifyJwt`, `setAuthCookie`, `clearAuthCookie`) and the `requireAuth` middleware that enforces token checks on protected routes.
  - Handles bcrypt operations inside `/signup` (hashing with `bcrypt.hash`) and `/signin` (verification with `bcrypt.compare`).
  - Defines all page routes plus nutrition/diet/profile APIs, so every feature endpoint lives here.
  - Reads environment variables (`PORT`, `MONGO_URI`, `SESSION_SECRET`, `JWT_SECRET`, `NODE_ENV`) to configure ports, database, session, and token behavior.

- `server/models/User.js`
  - Declares the Mongo schema for identities, profile fields, nutrition settings, and current diet plan reference.
  - Holds arrays/enums for dietary preferences, allergies, and notification toggles.

- `server/models/Dish.js`
  - Stores nutritional macros, dietary tags, cuisine metadata, and restrictions that drive filtering and swaps.

- `server/models/DietPlan.js`
  - Represents generated plans, daily meal breakdowns, macro totals, and preference metadata.

- `server/seedDishes.js`
  - Script that connects to Mongo, wipes existing dishes, and inserts curated dish documents used by diet generation APIs.

- `server/views/**/*.ejs`
  - Marketing pages (`home`, `about`, `contact`, `pricing`, `training`) and authenticated pages (`diet`, `profile`, auth forms) rendered by Express routes.

- `assets/js/*.js` & `server/assets/js/*.js`
  - View-specific front-end logic (dashboard interactions, diet UI, auth forms).

- `assets/css/*.css` & `server/assets/css/*.css`
  - Styling for marketing and authenticated pages; server copies are the versions actually served.

## Next Steps

- Wire up the included `connect-redis` store for distributed sessions if scaling beyond a single instance.
- Add automated tests and CI before production deployments.


