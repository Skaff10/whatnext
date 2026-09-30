# WHAT NEXT? 📼🕹️

A retro 90s personal tracker for movies, series, and video games. Inspired by neighborhood VHS rental shops and arcade cabinets, **What Next?** helps you log what you have finished, score titles on an arcade score scale, and maintain a wishlist to answer that perpetual question: *"What should I watch or play next?"*

---

## ⚡ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom retro pixel engine in `app/globals.css` (zero border radius, chunky pixel borders, hard offset shadows, CRT scanlines, vignette, and stepped animations)
- **Database**: [Firebase Firestore](https://firebase.google.com/) via `firebase-admin` server-side SDK (100% server-side, client access blocked)
- **Media APIs**:
  - **TMDB API** for movies & series (cached genre mapping + posters via `https://image.tmdb.org`)
  - **RAWG API** for video games (game data, covers & genres via `https://rawg.io`)
- **Typography**: Google Fonts via `next/font` (`Press Start 2P` for arcade headers & scores; `VT323` for terminal body text)
- **Deployment**: Vercel

---

## 🛠️ Prerequisites & API Keys

### 1. TMDB API Key (Movies & TV Series)
1. Sign up or log into [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Navigate to **Settings** -> **API** -> **Request an API Key** (Developer).
3. Copy your **API Key (v3 auth)**.

### 2. RAWG API Key (Video Games)
1. Sign up or log into [RAWG](https://rawg.io/apidocs).
2. Go to **API Keys** and click **Get an API Key**.
3. Copy your API Key.

### 3. Firebase Project & Service Account (Database)
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `what-next-tracker`).
2. In the left sidebar, click **Build** -> **Firestore Database** -> **Create Database**.
3. Choose a location closest to you and start in **Production mode** (or paste the security rules below).
4. Go to **Project Settings** (gear icon next to Project Overview) -> **Service accounts** tab.
5. Under **Firebase Admin SDK**, select **Node.js** and click **Generate new private key**.
6. A JSON file will download. Open it and locate:
   - `project_id` -> corresponds to `FIREBASE_PROJECT_ID`
   - `client_email` -> corresponds to `FIREBASE_CLIENT_EMAIL`
   - `private_key` -> corresponds to `FIREBASE_PRIVATE_KEY`

---

## 🔒 Firestore Security Rules (Paste in Firebase Console)

Because **What Next?** operates exclusively through Next.js server-side Route Handlers with the Firebase Admin SDK, direct browser read and write access should be completely disabled:

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

To apply:
1. In Firebase Console, go to **Firestore Database** -> **Rules**.
2. Replace everything with the rules snippet above.
3. Click **Publish**.

---

## 🚀 Local Development Setup

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the project root (see `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

   Fill in your actual keys in `.env.local`:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   RAWG_API_KEY=your_rawg_api_key_here
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```

   > **Note on `FIREBASE_PRIVATE_KEY`**: Ensure the private key is enclosed in double quotes and keeps literal `\n` characters (or actual newlines). The server helper in `lib/firebase-admin.ts` automatically parses escaped `\n` characters.

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment to Vercel

1. Push your project code to a GitHub/GitLab repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
3. Import your repository.
4. Under **Environment Variables**, add the 5 variables:
   - `TMDB_API_KEY`
   - `RAWG_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
     *(When pasting in the Vercel dashboard, paste the entire string including the quotes and `\n` escapes)*
5. Click **Deploy**.

---

## 🕹️ Key Features

- **Retro Aesthetic**: Custom CRT scanlines, vignette, zero border radius, chunky 3-4px pixel borders, hard offset drop shadows, and responsive layouts.
- **VHS & Cartridge Cards**: Movies and Series look like classic VHS tape sleeves; Games feature cartridge grip notches.
- **Arcade Score Rating**:
  - Discrete 0.0 to 10.0 scale with 0.1 steps.
  - Custom retro segmented volume/health slider synchronized with an arcade number input.
  - Arcade score badges colored by tier: Magenta (< 5.0), Amber (5.0 - 7.9), Lime (8.0+).
- **Strict Business Logic**:
  - Wishlist items can never have a rating (enforced in UI & server validation).
  - Moving to wishlist clears rating with confirmation.
  - Moving from wishlist to watched/completed immediately prompts to rate (or skip).
- **"Pick For Me" Oracle**:
  - Fast slot-machine style shuffle that randomly selects a title from your Wishlist to solve analysis paralysis.
- **Optimistic UI**:
  - Instant UI feedback on adds, updates, and deletes with automatic rollback and retro toasts if network fails.
- **Level Up! Celebration**:
  - Flashing 90s arcade banner when logging a masterpiece (score >= 9.0).

---

## 📋 Assumptions Made

1. **Single-User Architecture**: No authentication or multiple tenants. All records reside in the Firestore root collection `items`.
2. **Deterministic Document IDs**: IDs use format `${type}-${externalId}` (e.g., `movie-603`, `game-3498`) to prevent duplicate additions.
3. **Rating Tiers**:
   - `< 5.0`: Hot Magenta (`#FF3D81`)
   - `5.0 - 7.9`: Amber (`#FFB000`)
   - `>= 8.0`: Lime (`#A6FF00`)
4. **Data Attribution**: Attributions for TMDB and RAWG are prominently displayed in the retro footer as required by both providers' terms of use.
