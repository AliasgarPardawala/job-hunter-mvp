# 📘 Job Hunter MVP

## Overview
A minimal job board MVP that:
- Crawls **one public job site** (RemoteOK) using **Playwright**.
- Stores jobs into a local **SQLite** database.
- Exposes them through an **Express API**.
- Displays them in a **React + Vite + TypeScript** UI styled with **Material UI (MUI)**.
- Supports **search, filters, sorting, pagination**, and an **Apply** link.

---

## 🛠️ Tech Stack

- **Crawler**: Node.js + TypeScript + Playwright + sqlite3
- **Database**: SQLite (local file `server/data/jobs.db`)
- **API**: Express.js
- **UI**: React + Vite + TypeScript + Material UI (MUI)

---

## 🚀 Setup Instructions

### 1. Clone repo & install dependencies
```
git clone <your-repo-url>
cd job-hunter-mvp
```

Install dependencies for each part:

```
cd crawler && npm install
cd ../server && npm install
cd ../ui && npm install
```

⚠️ **Important**: You must also install Playwright’s browser binaries:
```
cd crawler
npx playwright install
```

---

### 2. Run crawler
Run WeWorkRemotely crawler:
```
cd crawler
npm run start
```
This will scrape jobs and insert them into `server/data/jobs.db`.

---

### 3. Run server
```
cd ../server
npm run dev
```
The API runs at: [http://localhost:4000/api/jobs](http://localhost:4000/api/jobs)

---

### 4. Run UI
```bash
cd ../ui
npm run dev
```
Open: [http://localhost:5173](http://localhost:5173)

---

## 🎨 UI Features

- **Search**: keyword search by job title and company name.
- **Filters**: by tag.
- **Sorting**: newest first or title A–Z.
- **Pagination**: server-driven, controlled by API.
- **Job Cards**: show title, company, location, tags and **Apply** button (opens external posting).

---

## 🏗️ Architectural Choices & Assumptions

1. **SQLite**: chosen for simplicity and local persistence. Single file DB is enough for MVP.
2. **Crawler**:
    - Server-side only (not from browser).
    - No retry/backoff or throttling is implemented (simplified for MVP).
    - Runs once and saves jobs directly into DB.
3. **API**:
    - Stateless Express server.
    - Reads DB at runtime, no caching layer (MVP simplicity).
4. **UI**:
    - Built with Vite + React + MUI for fast development.
    - Calls API at runtime, no client-side DB.
5. **Sources**: limited to one job board(`remoteok.com`) to comply with assignment rules.

---

## ⚠️ Limitations

- **Single data source**: only one public job board is crawled.
- **No throttling/retries**: crawler may fail if site is slow or blocks requests.
- **Incomplete fields**: scraped fields depend on site structure; some jobs may lack summary/location.
- **No auth**: API/UI are public and unsecured (MVP only).
- **Local only**: SQLite is local; no cloud deployment included.
- **Data freshness**: must re-run crawler to refresh jobs (no scheduler included).
- **Duplicates**: the crawler may insert duplicates if run multiple times.  
  👉 To avoid this, for now we **wipe the `jobs` table before scraping** (e.g., `DELETE FROM jobs;`).

---
