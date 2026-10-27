# 📼 WHAT NEXT? (BLACKLIST) 🕹️

[![GitHub Repository](https://img.shields.io/badge/GitHub-Skaff10%2Fwhatnext-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Skaff10/whatnext)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.7-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase Admin](https://img.shields.io/badge/Firebase-Admin%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

> **"INSERT COIN TO CONTINUE"**  
> A personal 90s retro archive & entertainment tracker for Movies, Series, and Video Games.  
> Inspired by neighborhood VHS rental shops, classic CRT monitors, and golden-age arcade cabinets.

---

## 📑 Table of Contents

- [📖 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🎨 Retro Pixel Design System](#-retro-pixel-design-system)
- [🏗️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🗄️ Data Model & Zod Validation](#️-data-model--zod-validation)
- [🔌 API Reference](#-api-reference)
- [🔒 Firestore Security Architecture](#-firestore-security-architecture)
- [🔑 Prerequisites & API Key Acquisition](#-prerequisites--api-key-acquisition)
- [🚀 Local Development Setup](#-local-development-setup)
- [☁️ Production Deployment (Vercel)](#️-production-deployment-vercel)
- [🎯 Business Logic & Edge Case Matrix](#-business-logic--edge-case-matrix)
- [⚖️ License & Attribution](#️-license--attribution)

---

## 📖 Overview

**What Next?** (internal title **Blacklist**) is a full-stack personal tracker tailored to answer the ultimate dilemma: *"What should I watch or play next?"* 

Built on **Next.js 16 (App Router)** and **React 19**, the application combines nostalgic 1990s visual design—complete with scanlines, CRT screen curvature, chunky pixel borders, and arcade cabinet typography—with modern server-side engineering. It synchronizes with **The Movie Database (TMDB)** for cinema and television releases and **RAWG** for video games, storing all media records either in **Google Cloud Firestore** (via the isolated `firebase-admin` server SDK) or a built-in **local JSON storage engine** for zero-configuration offline workflows.

---

## ✨ Key Features

### 🎬 Tri-Media Tracking (Movies, Series, Video Games)
- **Seamless Live Search**: Query movies, series, or video games using integrated TMDB and RAWG APIs with debounced input and instantaneous metadata retrieval.
- **Enriched Metadata**: Automatically pulls posters, release years, genre classifications, platform lists, and narrative summaries.
- **Deterministic ID Deduplication**: Generates deterministic document keys (`${type}-${externalId}`) preventing accidental duplicates in library shelves.

### 🎮 Dual-Shelf Taxonomy (Active Library vs. Wishlist)
- **Library Records**: Dedicated shelves for titles you have completed (`watched` for movies/series; `completed` or `played` for games).
- **Universal Wishlist**: Consolidated backlog bucket for pending media across all three categories.
- **Type-Aware Filtering**: Filter wishlist items globally or isolate by Movies, Series, or Video Games.

### 🎰 "Pick For Me" Slot Machine Oracle
- **Arcade Slot Reel Animation**: High-speed 18-cycle shuffle iterating through your current wishlist items.
- **Decisive Recommendation**: Stops on a randomized title, automatically highlighting the card with neon magenta pulsing frames and opening full item details to break decision paralysis.

### 🕹️ Arcade Score Engine (0.0 – 10.0 Scale)
- **Precise 0.1 Decimal Step**: Rate titles on an arcade scale from `0.0` to `10.0`.
- **Synchronized Controls**: Dual input pairing an arcade health-bar style range slider with a direct numerical score input.
- **Dynamic Tier-Based Badge Coloring**:
  - 🟣 **Magenta** (`#FF3D81`): Scores `< 5.0`
  - 🟡 **Amber** (`#FFB000`): Scores `5.0 – 7.9`
  - 🟢 **Lime** (`#A6FF00`): High scores `8.0 – 10.0`

### 🏆 "Level Up! Masterpiece" Celebration
- **Flashing Neon Arcade Banner**: Logging or updating any title with a score of `9.0` or higher triggers a retro arcade `LEVEL UP!` visual celebration.

### 📊 Retro Stats Strip & LED Counters
- **Live Counter Widgets**: Dynamic tallies for Total Games (Completed + Played), Movies Watched, Series Watched, and Wishlist backlog.
- **LED Digit Padding**: Classic arcade scoreboard formatting with zero-padded numerals (e.g., `01`, `09`, `42`).

### 🔎 Search, Filter & Sort Matrix
- **Deep Text Filtering**: Real-time filtering against title names, release years, and genre tags.
- **Sorting Modes**:
  - `Recently Added` (Default chronological order)
  - `Highest Rated` (Arcade leaderboard)
  - `Lowest Rated`
  - `Title (A - Z)`
  - `Release Year (Newest First)`

### ⚡ Optimistic UI Updates & Retro Toasts
- **Zero Latency Interaction**: Library additions, status transitions, rating changes, and removals execute immediately in local client state.
- **Fail-Safe Rollback**: Reverts automatically to previous state and fires an 8-bit retro notification toast if network mutations fail.

### 🛡️ Dual-Storage Engine (Firebase + Local JSON Fallback)
- **Production Mode**: Backed by Google Cloud Firestore via `firebase-admin` server SDK.
- **Zero-Config Offline Mode**: Automatically detects absent Firebase credentials and falls back transparently to local disk persistence at `.data/items.json`.

---

## 🎨 Retro Pixel Design System

The visual design system in `app/globals.css` completely strips modern web conventions (rounded corners, soft blurs, generic flat palettes) in favor of authentic 90s computing aesthetics:

| Component | Visual Specification | Implementation |
|---|---|---|
| **Border Radius** | Hard `0px` enforced universally | `*, *::before, *::after { border-radius: 0 !important; }` |
| **Color Palette** | Night Sky, Cyber Cyan, Hot Magenta, Lime, Amber, CRT Cream | CSS Custom Variables (`--bg-night: #14101F`, `--cyan: #2DE2E6`, etc.) |
| **Typography** | `Press Start 2P` (Headings, Badges, Scores) & `VT323` (Body & Metadata) | `next/font/google` variable font configuration |
| **CRT Effects** | Repeating horizontal scanline texture & radial vignette shadow | CSS pseudo-layers (`.crt-scanlines`, `.crt-vignette`) |
| **Shadows** | Chunky 3px–6px offset hard black shadows with zero blur | `.pixel-shadow { box-shadow: 4px 4px 0 #000; }` |
| **VHS Cards** | Movie & series cards styled as VHS cassette slipcases | `.vhs-tape-box` with magnetic tape spine accent |
| **Game Cards** | Cartridge box design with top grip notches | `.game-cartridge-box` with multi-step cartridge vents |
| **Blinking Cursor**| Classic terminal input indicator | `@keyframes blink` with `inline-block` prompt block |

---

## 🏗️ System Architecture & Data Flow

```text
               +---------------------------------------------------+
               |             Client Browser (React 19)             |
               |  - Retro VHS / Cartridge UI                       |
               |  - Optimistic State Machine                       |
               |  - Slot Machine Oracle & Arcade Slider Controls   |
               +-------------------------+-------------------------+
                                         |
                                         | HTTPS / JSON
                                         v
               +---------------------------------------------------+
               |             Next.js 16 App Router                 |
               |                  Route Handlers                   |
               |                                                   |
               |  [GET/POST /api/items]  [PATCH/DELETE /api/items] |
               |               [GET /api/search]                   |
               +------------+--------------------+-----------------+
                            |                    |
             Zod Validation |                    | External Search
             & Business Rule|                    v
             Enforcement    |        +-----------------------+
                            |        |    Third-Party APIs   |
                            |        |  - TMDB v3 (Cinema)   |
                            |        |  - RAWG (Video Games) |
                            |        +-----------------------+
                            v
               +---------------------------------------------------+
               |               Storage Layer Dispatcher            |
               |               (lib/storage.ts)                    |
               +-------------------------+-------------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
           (Firebase Configured)                 (Fallback / Dev)
                       v                                   v
        +-----------------------------+     +-----------------------------+
        |   Firebase Admin SDK        |     |   Local File System         |
        |   Google Cloud Firestore    |     |   .data/items.json          |
        |   Collection: "items"       |     |   (Persistent JSON store)   |
        +-----------------------------+     +-----------------------------+
```

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16.3.7](https://nextjs.org/) | App Router architecture, Server Route Handlers, Turbopack |
| **UI Library** | [React 19.2.8](https://react.dev/) | Client state hooks, memoized counters, optimistic updates |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end typing, discriminating status unions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Tailwind CSS v4 with custom theme tokens & custom CRT scanline engine |
| **Schema Validation**| [Zod 4.6.5](https://zod.dev/) | Strict request body validation, superRefine status/rating logic |
| **Database** | [Firebase Admin SDK 14.5](https://firebase.google.com/) | Server-side Google Cloud Firestore access bypassing client SDKs |
| **Local Storage** | Node.js File System (`fs`) | Transparent local JSON fallback persistence |
| **Movie & TV API** | [TMDB API v3](https://www.themoviedb.org/) | Movie and television search, genre mapping, poster delivery |
| **Video Game API** | [RAWG API](https://rawg.io/apidocs) | Game database query, platforms, Metacritic ratings, box art |
| **Typography** | [Google Fonts](https://fonts.google.com/) | `Press Start 2P` & `VT323` via `next/font/google` |

---

## 📁 Project Directory Structure

```text
what-next/
├── app/
│   ├── api/
│   │   ├── items/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts          # PATCH (update) & DELETE (remove) item
│   │   │   └── route.ts              # GET (list all) & POST (create new item)
│   │   └── search/
│   │       └── route.ts              # GET media search proxy (TMDB & RAWG)
│   ├── favicon.ico                   # Pixel icon favicon
│   ├── globals.css                   # Retro CRT scanlines, pixel borders & palette tokens
│   ├── layout.tsx                    # Root HTML layout with Google Font bindings
│   └── page.tsx                      # Main client application, state manager & views
├── components/
│   ├── AddModal.tsx                  # Media search, selection, destination & rating dialog
│   ├── Badge.tsx                     # Pixel badges for status & rating score tiers
│   ├── Card.tsx                      # VHS tape and Game cartridge card representations
│   ├── DetailModal.tsx               # Full metadata view, status updates, ratings & deletion
│   ├── EmptyState.tsx                # Retro 8-bit blank state placeholder
│   ├── FilterBar.tsx                 # Category switcher, status filters, search input & sorter
│   ├── Footer.tsx                    # Retro terminal footer with personal branding & attributions
│   ├── Header.tsx                    # Top navigation, logo with animated pulse & ADD button
│   ├── LevelUpOverlay.tsx            # Fullscreen arcade celebration banner (score >= 9.0)
│   ├── LoadingScreen.tsx             # 8-bit arcade loading indicator with blinking prompt
│   ├── PixelIcons.tsx                # Hand-crafted SVG pixel icons (gamepad, film, tv, star, etc.)
│   ├── RatingControl.tsx             # Synchronized arcade slider & numeric score input
│   ├── SlotMachinePicker.tsx         # Wishlist "Pick For Me" slot machine selector
│   ├── StatsStrip.tsx                # High-level counters for completed media and backlog
│   └── Toast.tsx                     # 8-bit retro notification toast container
├── lib/
│   ├── external-apis.ts              # TMDB & RAWG API clients with genre memory cache
│   ├── firebase-admin.ts             # Firebase Admin SDK initialization & credential parser
│   ├── storage.ts                    # Dual-mode persistence layer (Firestore vs. local JSON)
│   └── types.ts                      # TypeScript definitions, Zod schemas & status rules
├── .data/                            # Local JSON database storage directory (git-ignored)
│   └── items.json
├── firestore.rules                   # Strict Firestore rules (deny all direct client access)
├── next.config.ts                    # Next.js image domain configuration for TMDB & RAWG
├── package.json                      # Project dependencies & scripts
├── postcss.config.mjs                # PostCSS configuration for Tailwind CSS v4
├── tsconfig.json                     # TypeScript compiler configuration
└── README.md                         # Documentation
```

---

## 🗄️ Data Model & Zod Validation

### TypeScript Item Interface (`lib/types.ts`)

```typescript
export type ItemType = "movie" | "series" | "game";
export type MovieSeriesStatus = "watched";
export type GameStatus = "completed" | "played";
export type ItemStatus = "watched" | "completed" | "played";

export interface Item {
  id: string;             // Deterministic format: `${type}-${externalId}`
  type: ItemType;         // "movie" | "series" | "game"
  externalId: number;     // Upstream ID from TMDB or RAWG
  title: string;          // Media title
  year: number | null;    // Release year
  posterUrl: string | null;
  overview: string;       // Synopsis or game description
  genres: string[];       // Array of genre strings
  status: ItemStatus | null; // null when item is in Wishlist
  isWishlist: boolean;    // Flag indicating wishlist backlog status
  rating: number | null;  // Float from 0.0 to 10.0 (1 decimal place); null if wishlist
  addedAt: string;        // ISO 8601 timestamp
  updatedAt: string;      // ISO 8601 timestamp
}
```

### Zod Validation Rules

All payload validation is enforced on the server before persisting:

- **Type Validity**: `type` must strictly be `"movie"`, `"series"`, or `"game"`.
- **Status Constraints**:
  - `movie` / `series`: Allowed statuses are `["watched"]`.
  - `game`: Allowed statuses are `["completed", "played"]`.
- **Wishlist Rating Rule**: Items where `isWishlist === true` are forbidden from having a rating (`rating` must be `null`).
- **Score Range**: `rating` must be between `0.0` and `10.0` and rounded to one decimal place (`roundToOneDecimal`).

---

## 🔌 API Reference

### 1. `GET /api/items`
Retrieves all items from storage, ordered by `addedAt` descending.

**Response `(200 OK)`**:
```json
{
  "items": [
    {
      "id": "game-3498",
      "type": "game",
      "externalId": 3498,
      "title": "Grand Theft Auto V",
      "year": 2013,
      "posterUrl": "https://media.rawg.io/media/games/...",
      "overview": "Rockstar Games action-adventure...",
      "genres": ["Action", "Adventure"],
      "status": "completed",
      "isWishlist": false,
      "rating": 9.5,
      "addedAt": "2026-10-27T10:00:00.000Z",
      "updatedAt": "2026-10-27T10:00:00.000Z"
    }
  ]
}
```

---

### 2. `POST /api/items`
Creates a new record in the collection.

**Payload**:
```json
{
  "type": "movie",
  "externalId": 603,
  "title": "The Matrix",
  "year": 1999,
  "posterUrl": "https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "overview": "Set in the 22nd century...",
  "genres": ["Action", "Sci-Fi"],
  "status": "watched",
  "isWishlist": false,
  "rating": 9.8
}
```

**Status Codes**:
- `201 Created`: Successfully stored item.
- `400 Bad Request`: Validation failure (e.g. invalid status or wishlist rating provided).
- `409 Conflict`: Item already exists in library (`id` conflict).

---

### 3. `PATCH /api/items/[id]`
Updates an item's status, wishlist state, or rating.

**Payload**:
```json
{
  "status": "completed",
  "isWishlist": false,
  "rating": 8.7
}
```

**Automatic Conversions**:
- Moving an item to Wishlist (`isWishlist: true`) automatically clears `status` and `rating` to `null`.
- Moving an item to Library requires a valid type-specific status.

---

### 4. `DELETE /api/items/[id]`
Removes an item from the collection.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "id": "movie-603"
}
```

---

### 5. `GET /api/search?type={type}&q={query}`
Proxies live queries to TMDB or RAWG.

**Query Parameters**:
- `type`: Target category (`"movie"`, `"series"`, or `"game"`).
- `q`: Search keyword.

**Response `(200 OK)`**:
```json
{
  "results": [
    {
      "externalId": 603,
      "title": "The Matrix",
      "year": 1999,
      "posterUrl": "https://image.tmdb.org/t/p/w342/...",
      "overview": "Set in the 22nd century...",
      "genres": ["Action", "Science Fiction"]
    }
  ]
}
```

---

## 🔒 Firestore Security Architecture

Because **What Next?** conducts 100% of its database read and write operations via Next.js Server Route Handlers using the privileged `firebase-admin` SDK, **all direct client-side reads and writes are strictly forbidden**.

### `firestore.rules`

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all direct client reads and writes.
    // The server-side Firebase Admin SDK automatically bypasses these rules.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Benefits**:
1. Eliminates attack vectors from client-side token exposure.
2. Prevents users or bad actors from issuing unvalidated mutations to Firestore.
3. Centralizes all data sanitization in server-side Zod validation schemas.

---

## 🔑 Prerequisites & API Key Acquisition

Before running in production mode, obtain the necessary API credentials:

### 1. TMDB API Key (Movies & TV Series)
1. Sign up or log into [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Navigate to **Account Settings** ➔ **API** ➔ **Request an API Key** (choose *Developer*).
3. Fill out the application details and copy your **API Key (v3 auth)**.

### 2. RAWG API Key (Video Games)
1. Register for an account at [RAWG API Docs](https://rawg.io/apidocs).
2. Go to **API Keys** and click **Get an API Key**.
3. Copy your generated personal token.

### 3. Firebase Service Account (Production Database)
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g., `what-next-tracker`).
2. Go to **Build** ➔ **Firestore Database** ➔ **Create Database** (choose standard production mode).
3. Open **Project Settings** (gear icon) ➔ **Service accounts** tab.
4. Select **Node.js** under Firebase Admin SDK and click **Generate new private key**.
5. Save the downloaded `.json` file and extract the three fields:
   - `project_id` ➔ `FIREBASE_PROJECT_ID`
   - `client_email` ➔ `FIREBASE_CLIENT_EMAIL`
   - `private_key` ➔ `FIREBASE_PRIVATE_KEY`

---

## 🚀 Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/Skaff10/whatnext.git
cd whatnext
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your configuration:

```env
# TMDB API Key (Movies & TV Series search)
TMDB_API_KEY=your_tmdb_api_key_here

# RAWG API Key (Video Games search)
RAWG_API_KEY=your_rawg_api_key_here

# Firebase Admin SDK Credentials (Optional for local offline mode)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

> [!TIP]
> **Zero-Config Local Mode**: If you omit `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`, the application automatically activates local disk storage under `.data/items.json`. You only need `TMDB_API_KEY` and `RAWG_API_KEY` to start testing immediately!

### 3. Launch Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Production Deployment (Vercel)

Deploying **What Next?** to [Vercel](https://vercel.com/) takes less than 3 minutes:

1. Push your repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com/) and select **Add New...** ➔ **Project**.
3. Import your `whatnext` repository.
4. Expand **Environment Variables** and add all 5 variables:
   - `TMDB_API_KEY`
   - `RAWG_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` *(Ensure quotes and escaped `\n` characters are pasted directly)*
5. Click **Deploy**.

---

## 🎯 Business Logic & Edge Case Matrix

| Scenario | System Behavior |
|---|---|
| **Adding duplicate title** | Server checks deterministic ID (`${type}-${externalId}`); returns `409 Conflict` and UI warns user that the title is already shelved. |
| **Adding to Wishlist** | Rating inputs are disabled. In Firestore, `rating` is forced to `null` and `isWishlist` is set to `true`. |
| **Moving Shelved item to Wishlist** | User is shown an explicit confirmation warning that existing rating will be erased. Upon confirmation, rating and status are cleared to `null`. |
| **Moving Wishlist item to Shelf** | Triggers "Move to Shelf" flow: prompts user to select a valid status (`watched` / `completed` / `played`) and optionally input an arcade score. |
| **Submitting rating >= 9.0** | Triggers the retro `LevelUpOverlay` celebration banner across the screen. |
| **Network failure during update** | Optimistic UI rollback restores previous card state and displays an 8-bit retro error toast. |
| **TMDB genre endpoint timeout** | Fallback static genre lookup table (`STATIC_TMDB_GENRES`) resolves genre identifiers seamlessly. |

---

## ⚖️ License & Attribution

- **Creator**: Developed by [Skaf](https://github.com/Skaff10).
- **Data Attribution**:
  - Movie & TV metadata provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
  - Video Game metadata and imagery provided by [RAWG Video Games Database](https://rawg.io/).
- **Fonts**:
  - *Press Start 2P* by CodeMan38 (SIL Open Font License).
  - *VT323* by Peter Hull (SIL Open Font License).
