# Local Directory

A small website that lists local businesses and lets an owner submit their own.
Frontend: plain HTML, CSS, JavaScript, jQuery and Bootstrap (no build step). Backend: Node, Express and MongoDB. Both deploy together from this repository root.

## Live links

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
├── api/                    ← root Vercel function
│   └── [...path].js
├── client/                 ← static frontend
│   ├── index.html           Home page
│   ├── directory.html       Directory page
│   ├── submit.html          Submit-a-business page
│   ├── css/
│   │   └── style.css        Full design system (light + dark mode)
│   └── js/
│       ├── config.js        API_BASE_URL — localhost locally, same-origin in production
│       ├── theme.js          Dark-mode toggle + persistence
│       ├── main.js           Navbar, mobile menu, scroll-reveal
│       ├── home.js           Stat counters + featured businesses
│       ├── directory.js      Search, filter, cards, modal
│       └── submit.js         Form validation + submission
├── server/                 ← Express API and MongoDB code
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

See `server/README.md` for full backend setup (MongoDB Atlas and local run).

## Deploying to Netlify

Netlify uses `netlify.toml` rather than `netlify.json`. The included configuration publishes `client/`, maps `/directory` and `/submit` to their HTML pages, and sends `/api/*` to the Netlify Function in `netlify/functions/api.js`.

1. Import the repository in Netlify.
2. Leave the base directory empty and use the included `netlify.toml` settings.
3. Add `MONGODB_URI` and `CLIENT_ORIGIN` under Site configuration → Environment variables. Set `CLIENT_ORIGIN` to the deployed Netlify site URL.
4. Deploy. The frontend uses same-origin `/api` requests automatically in production.

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

2. **Frontend** — serve the `client/` folder with a static server. `client/js/config.js` uses `http://localhost:3000` locally and the current site origin in production:
   ```bash
   npx serve client
   ```
   Then open `http://localhost:3000/` (or the port printed by the server).

## Deploying

| Part | Where | Notes |
|---|---|---|
| Website and API | Vercel | Root Directory: repository root (`.`). Framework preset: **Other**. No build command. Set `MONGODB_URI` and `CLIENT_ORIGIN`. |
| Database | MongoDB Atlas (free) | Create a cluster + database user, put the connection string in `server/.env`. |

### Deploying to Vercel

1. Push this repo to GitHub (see below).
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the `business-directory` repo.
3. In the project settings:
   - **Root Directory:** repository root (`.`)
   - **Framework Preset:** `Other`
   - **Build Command:** leave empty
   - **Output Directory:** leave as default (`.`)
4. Deploy. Vercel gives you a URL like `https://business-directory.vercel.app`. The root `vercel.json` routes pages and assets, while `api/[...path].js` handles `/api/*`.
5. Every push to your main branch redeploys automatically.

Set `MONGODB_URI` and `CLIENT_ORIGIN` in the Vercel project environment variables. Use the deployed site URL for `CLIENT_ORIGIN`, then redeploy.

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
