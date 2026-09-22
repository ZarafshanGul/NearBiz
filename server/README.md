# Local Directory — API

Node + Express + MongoDB API for the Local Directory frontend.

## Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/businesses` | All businesses, newest first. Supports `?q=` (search name/tagline/city) and `?category=` (filter), combinable. |
| `GET` | `/api/businesses/stats` | `{ total, cities, categories }` |
| `POST` | `/api/businesses` | Create a business. Returns the saved document, or `400` with a `fields` object naming what's wrong. |

Allowed categories: `Food, Fashion, Tech, Health, Education, Services, Retail, Other`.

## 1. Set up MongoDB Atlas (free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new project, then build a free **M0** cluster.
3. Under **Database Access**, add a database user with a username and password (save these — you'll need them below).
4. Under **Network Access**, add `0.0.0.0/0` so the Vercel function can connect to Atlas.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the string (before the `?`), e.g. `.../business-directory?retryWrites=true...`.

## 2. Run it locally

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and paste in your connection string:

```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/business-directory?retryWrites=true&w=majority
PORT=3000
CLIENT_ORIGIN=*
```

Then seed the database (loads 10 sample businesses, once):

```bash
npm run seed
```

Start the server:

```bash
npm start
```

Visit `http://localhost:3000` — you should see a small JSON status response. Try `http://localhost:3000/api/businesses` in your browser to confirm the seed data loaded.

## 3. Deploy the API to Vercel

1. Push this repo to GitHub (see the root README).
2. On [vercel.com](https://vercel.com), create a new project from your GitHub repo.
3. Set:
   - **Root Directory:** `server`
   - **Framework Preset:** `Other`
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
4. Add `MONGODB_URI` and `CLIENT_ORIGIN` environment variables.
5. Deploy and copy the API project URL.
6. Paste that URL into `client/js/config.js` as `API_BASE_URL`, then redeploy the client project.

The API is exported as a Vercel function in `server/api/[...path].js`. `server/server.js` remains the local development entry point.

## Folder structure

```
server/
├── server.js               Entry point
├── config/db.js             MongoDB connection
├── models/Business.js       Mongoose schema
├── controllers/
│   └── businessController.js  Route handlers (list, stats, create)
├── routes/businesses.js      Express router
├── utils/validateBusiness.js Field-by-field validation, shared by the controller
├── seed/
│   ├── data.js               10 sample businesses
│   └── seed.js               Seed script (npm run seed)
├── .env.example
└── package.json
```

## Troubleshooting

- **"Missing MONGODB_URI"** — you haven't created `.env`, or it's empty. Copy `.env.example` to `.env` and fill it in.
- **Connection timeout** — check Network Access in Atlas includes `0.0.0.0/0`, and that your password in the connection string doesn't contain characters that need URL-encoding (e.g. `@`, `#`, `%`).
- **Seed says "already has businesses"** — that's expected on a second run; it won't create duplicates. Drop the collection in Atlas if you want to reseed from scratch.
