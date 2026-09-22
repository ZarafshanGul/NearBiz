# Local Directory

A small website that lists local businesses and lets an owner submit their own.
Frontend: plain HTML, CSS, JavaScript, jQuery and Bootstrap (no build step). Backend: Node, Express and MongoDB. Both are included in this repo.

## Live links

- **Website (Vercel):** `PASTE YOUR VERCEL URL HERE`
- **API (Vercel):** `PASTE YOUR API VERCEL URL HERE`

> The API runs as a Vercel function backed by MongoDB Atlas.

## Screenshots

| Home | Directory | Submit |
|---|---|---|
| `add screenshot` | `add screenshot` | `add screenshot` |

| Dark mode | Mobile |
|---|---|
| `add screenshot` | `add screenshot` |

## Project structure

```
business-directory/
├── client/                 ← this frontend (deploys to Vercel)
│   ├── index.html           Home page
│   ├── directory.html       Directory page
│   ├── submit.html          Submit-a-business page
│   ├── vercel.json          Vercel config (clean URLs)
│   ├── css/
│   │   └── style.css        Full design system (light + dark mode)
│   └── js/
│       ├── config.js        API_BASE_URL — set this to your API Vercel URL
│       ├── theme.js          Dark-mode toggle + persistence
│       ├── main.js           Navbar, mobile menu, scroll-reveal
│       ├── home.js           Stat counters + featured businesses
│       ├── directory.js      Search, filter, cards, modal
│       └── submit.js         Form validation + submission
├── server/                 ← the API (deploys to Vercel)
│   ├── server.js
│   ├── config/db.js
│   ├── models/Business.js
│   ├── controllers/businessController.js
│   ├── routes/businesses.js
│   ├── utils/validateBusiness.js
│   ├── seed/{data.js, seed.js}
│   └── .env.example
├── .gitignore
└── README.md
```

See `server/README.md` for full backend setup (MongoDB Atlas, local run, Vercel deploy).

## Design

- **Palette:** ink `#16211C`, paper `#F5F1E6`, forest green `#24402F`, gold `#D9A441`, brick `#B5482F`
- **Type:** Fraunces (display) + Work Sans (body), loaded from Google Fonts
- **Dark mode:** toggled in the navbar, persisted with `localStorage`, applied before first paint to avoid a flash of the wrong theme
- **Motion:** one staggered hero entrance on load, scroll-triggered reveals via `IntersectionObserver`, animated stat counters, card/modal hover and transition states. All motion respects `prefers-reduced-motion`.

## Running it locally

1. **Backend** — see `server/README.md` for full details. Short version:
   ```bash
   cd server
   npm install
   cp .env.example .env   # then paste in your MongoDB Atlas connection string
   npm run seed             # loads 10 sample businesses, once
   npm start
   ```
   The API runs at `http://localhost:3000` by default.

2. **Frontend** — open `client/js/config.js` and point `API_BASE_URL` at your running API:
   ```js
   const API_BASE_URL = "http://localhost:3000"; // local development; set the Vercel API URL for production
   ```
   Serve the `client/` folder with a static server so the browser uses clean web URLs instead of showing the local `file:///C:/...` path:
   ```bash
   npx serve client
   ```
   Then open `http://localhost:3000/` (or the port printed by the server).

## Deploying

| Part | Where | Notes |
|---|---|---|
| Frontend | Vercel | Root Directory: `client`. Framework preset: **Other**. No build command. Redeploys on every push. |
| API | Vercel | Root directory `server`, Vercel function in `api/[...path].js`, env vars `MONGODB_URI` and `CLIENT_ORIGIN`. |
| Database | MongoDB Atlas (free) | Create a cluster + database user, put the connection string in `server/.env`. |

### Deploying the frontend to Vercel

1. Push this repo to GitHub (see below).
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the `business-directory` repo.
3. In the project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Other`
   - **Build Command:** leave empty
   - **Output Directory:** leave as default (`.`)
4. Deploy. Vercel gives you a URL like `https://business-directory.vercel.app`.
5. Every push to your main branch redeploys automatically.

`client/vercel.json` is already set up with clean URLs, so no further config is needed.

After deploying the API, update `client/js/config.js` with the live API Vercel URL and push again — Vercel redeploys automatically.

## API used by the frontend

| Route | Used for |
|---|---|
| `GET /api/businesses` | Directory grid. Supports `?q=` (search) and `?category=` (filter), combinable. |
| `GET /api/businesses/stats` | Home page counters (`total`, `cities`, `categories`). |
| `POST /api/businesses` | Submit form. On `400`, the response's `fields` object is mapped to the matching input's error message. |

Categories used throughout: `Food, Fashion, Tech, Health, Education, Services, Retail, Other`.

## Done-when checklist

- [ ] Submitting a business on the live site makes it appear on the live directory
- [ ] Home, Directory and Submit all work on a phone screen
- [ ] Light and dark mode both work correctly on all three pages
- [ ] No errors in the browser console
- [ ] Live URLs and screenshots are filled in above
