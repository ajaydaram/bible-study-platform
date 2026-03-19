# Scriptorium Bible App

A comprehensive Bible study platform featuring a **502-day chronological reading plan** spanning 13 Biblical Eras, from Genesis to Revelation. Built with React, TypeScript, Firebase, and TailwindCSS.

🌐 **Live App**: [https://scriptorium-bible-app.web.app](https://scriptorium-bible-app.web.app)

---

## ✨ Features

### 📖 502-Day Chronological Reading Plan
- **13 Biblical Eras** with color-coded navigation
- Complete Bible coverage from Creation to Revelation
- Daily readings with discussion prompts & prayer focus
- Key themes and cross-references for deeper study
- Auto-tagging for journal entries

### 📚 Biblical Eras

| Era | Name | Days | Content |
|-----|------|------|---------|
| 1 | 🌍 Era of Beginnings | 1-14 | Genesis 1-11 |
| 2 | ⛺ Era of the Patriarchs | 15-45 | Genesis 12-50 |
| 3 | 🔥 Era of Egypt & Exodus | 46-75 | Exodus, Leviticus |
| 4 | 🏜️ Era of the Wilderness | 76-105 | Numbers, Deuteronomy |
| 5 | ⚔️ Era of Conquest | 106-125 | Joshua |
| 6 | ⚖️ Era of the Judges | 126-150 | Judges, Ruth |
| 7 | 👑 Era of United Kingdom | 151-200 | Samuel, Kings, Chronicles |
| 8 | 🏛️ Era of Divided Kingdom | 201-260 | Kings, Chronicles, Prophets |
| 9 | ⛓️ Era of Exile | 261-290 | Ezekiel, Daniel, Lamentations |
| 10 | 🏗️ Era of Return | 291-310 | Ezra, Nehemiah, Malachi, Job |
| 11 | 📜 Era of Wisdom & Worship | 311-354 | Psalms, Proverbs, Ecclesiastes, Song of Solomon |
| 12 | ✝️ Era of the Messiah | 355-422 | The Four Gospels (chronologically) |
| 13 | ⛪ Era of the Church | 423-502 | Acts, Epistles, Revelation |

### 🛠️ Core Features
- **Audio Bible** - Listen to Scripture with BibleBrain integration (KJV, WEB)
- **Verse Sync** - Automatic verse highlighting during audio playback
- **Journal** - Personal notes with auto-tagging from readings
- **Prayer Tracking** - Track prayer requests and answers
- **Groups** - Community study groups
- **Discussions** - Engage with discussion prompts
- **Dark/Light Mode** - Full theme support
- **Progress Tracking** - Resume where you left off
- **Mobile Responsive** - Works on all devices

### 📱 PWA & Offline Support (NEW)
- **Installable App** - Add to home screen on any device
- **Offline Bible Reading** - Read without internet connection
- **Service Worker** - Automatic caching of Bible text & assets
- **IndexedDB Storage** - Local caching of readings & progress
- **Sync on Reconnect** - Automatic sync when back online

### 🔔 Push Notifications (NEW)
- **Daily Reading Reminders** - Configurable reminder times
- **Streak Alerts** - Get notified about streak milestones
- **Weekly Digest** - Summary of your reading progress
- **Firebase Cloud Messaging** - Reliable cross-platform delivery

### 🏆 Reading Streaks & Achievements (NEW)
- **22 Achievements** - Unlock badges for milestones
- **Streak Tracking** - Track consecutive reading days
- **Weekly Progress** - Visual calendar of your week
- **Gamification** - Encourages consistent engagement
- **Categories**: Streak, Progress, Special, Social

### 📚 Study Resources
- **Cross-References** - 30,000+ verses with 396,000+ references (Treasury of Scripture Knowledge + MetaV)
- **Commentary** - Matthew Henry's Concise Commentary
- **Word Study** - Greek & Hebrew lexicons (Strong's) with STEPBible morphology
- **Interlinear View** - Original language with translation
- **Morphology** - 1,645 Greek codes + 922 Hebrew codes from STEPBible
- **Family Trees** - 2,826 biblical people with relationships from STEPBible TIPNR
- **Versification** - Hebrew/Greek verse numbering differences
- **Creeds & Confessions** - Westminster, Heidelberg, etc.
- **Patristic Quotes** - Early Church Father writings

### 🕰️ Church History
- **Biblical Timeline** - Interactive timeline of events
- **Church Fathers** - Browse patristic writings
- **Historical Maps** - Biblical geography
- **People of the Bible** - Biographical information

### 🎵 Hymnal
- **Classic Hymns** - Traditional hymn collection
- **Lyrics & History** - Background on each hymn
- **Search & Browse** - Find hymns by title or theme

### 🧠 Scriptorium Pulse (NEW)
- **Theological Diagnostic** - 49-question assessment
- **7 Categories**: Faith, Scripture, Salvation, Church, Ethics, Identity, Relationships
- **Personalized Insights** - Scriptural recommendations based on results
- **Progress Tracking** - Save and compare results over time

### 📤 Sharing & Social (NEW)
- **Study Notes Sharing** - Share journal entries publicly, privately, or via link
- **PDF Export** - Export journal entries to PDF (single or batch)
- **Community Annotations** - Add notes, insights, questions, or prayers to any verse
- **Activity Feed** - See what others in the community are reading
- **Follow Users** - Follow other readers and see their activity
- **Verse Sharing** - Share verses with your followers

### 📋 Reading Plans (NEW)
- **Custom Plans** - Create your own reading plans with any passages
- **Plan Templates** - Bible-in-a-Year and other pre-made templates
- **Progress Tracking** - Track completion across multiple plans
- **Start/Pause/Resume** - Flexible plan management

### 🔍 Advanced Search (NEW)
- **Fuzzy Matching** - Find results even with typos
- **Category Filters** - Search journal, sermons, Bible books
- **Bible Reference Parsing** - Type "John 3:16" to go directly
- **Recent Searches** - Quick access to previous searches

### ♿ Accessibility (NEW)
- **Font Size Controls** - Adjustable text sizing
- **Dyslexic-Friendly Font** - OpenDyslexic font option
- **Line Spacing** - Normal, relaxed, or loose spacing
- **High Contrast Mode** - Enhanced visibility
- **Reduce Motion** - Disable animations
- **Screen Reader Mode** - Optimized for assistive technology
- **Enhanced Focus Indicators** - Clear keyboard navigation

### 🔗 Enhanced Cross-References (NEW)
- **30,412 Verses Covered** - Nearly complete Bible coverage (up from 2,602)
- **396,062 Cross-References** - Comprehensive verse connections
- **Two-Tier Loading** - Popular verses bundled, full data loaded on-demand
- **Verse Text Preview** - See referenced verse text inline
- **Filter by Testament** - Old Testament / New Testament filter
- **Parallel Passages** - Gospel parallels highlighted
- **Sort Options** - By relevance, book order, or votes
- **Improved UI** - Cards with color coding and badges

### 🔬 STEPBible Scholarly Data (NEW)
- **Greek Morphology** - 1,645 grammatical codes with explanations
- **Hebrew Morphology** - 922 grammatical codes with explanations
- **Biblical Family Trees** - 2,826 people with parent/child/spouse relationships
- **Versification Mapping** - Differences between English, Hebrew, and Greek numbering
- **Color-Coded Parts of Speech** - Visual grammar indicators in Word Study

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **TailwindCSS** | Styling |
| **Firebase Auth** | Authentication (Google, Email, Anonymous) |
| **Firestore** | Cloud Database |
| **Firebase Hosting** | Deployment |
| **Firebase Cloud Messaging** | Push Notifications |
| **Firebase Analytics** | User Behavior Tracking |
| **Firebase App Check** | API Protection |
| **Sentry** | Error Tracking |
| **vite-plugin-pwa** | PWA & Service Worker |
| **Workbox** | Runtime Caching |
| **IndexedDB** | Offline Storage |
| **jsPDF** | PDF Export |
| **React Router v6** | Client-side Routing |
| **Lucide React** | Icons |
| **date-fns** | Date Utilities |

---

## 📁 Project Structure

```
scriptorium-react/
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── layouts/            # Layout components
│   │   ├── StreakDisplay.tsx   # Reading streak UI
│   │   ├── AchievementsDisplay.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── OfflineIndicator.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── CrossReferencesPanel.tsx
│   │   ├── CommentaryPanel.tsx
│   │   ├── WordStudy.tsx
│   │   ├── InterlinearView.tsx
│   │   ├── ShareNoteModal.tsx  # Note sharing modal
│   │   ├── CommunityAnnotations.tsx
│   │   ├── ActivityFeed.tsx    # Social activity feed
│   │   ├── AccessibilitySettings.tsx
│   │   └── GuestBanner.tsx
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.tsx     # Firebase Auth context
│   │   ├── ThemeContext.tsx    # Dark/Light mode
│   │   ├── SearchContext.tsx   # Global search
│   │   └── AccessibilityContext.tsx
│   ├── data/                   # Static data files
│   │   ├── biblicalEras.ts     # 502-day reading plan
│   │   ├── churchFathers.ts    # Patristic data
│   │   ├── cross-references.json # Popular cross-refs (embedded)
│   │   ├── mhcc-commentary.json
│   │   ├── creeds/             # Creeds & confessions
│   │   └── stepbible/          # STEPBible data (morphology, people)
│   │       ├── greekMorphology.json
│   │       ├── hebrewMorphology.json
│   │       └── biblePeople.json
│   ├── lib/                    # Utilities & services
│   │   ├── firebase.ts         # Firebase config + Analytics
│   │   ├── firestore.ts        # Firestore CRUD operations
│   │   ├── achievements.ts     # Streaks & achievements
│   │   ├── notifications.ts    # FCM push notifications
│   │   ├── offlineStorage.ts   # IndexedDB caching
│   │   ├── crossReferences.ts  # TSK integration
│   │   ├── mhccCommentary.ts   # Commentary API
│   │   ├── interlinearApi.ts   # Greek/Hebrew
│   │   ├── bibleBrain.ts       # Audio API
│   │   ├── sharing.ts          # Note sharing system
│   │   ├── pdfExport.ts        # PDF export (jsPDF)
│   │   ├── communityAnnotations.ts
│   │   ├── advancedSearch.ts   # Fuzzy search
│   │   ├── readingPlans.ts     # Custom reading plans
│   │   ├── social.ts           # Social features
│   │   └── a11y.ts             # Accessibility utilities
│   ├── pages/                  # Page components
│   │   ├── auth/               # Sign in/up pages
│   │   ├── paths/              # Reading path pages
│   │   ├── resources/          # Study resources
│   │   ├── Dashboard.tsx
│   │   ├── Achievements.tsx
│   │   ├── Settings.tsx
│   │   ├── Pulse.tsx           # Theological diagnostic
│   │   ├── ReadingPlans.tsx    # Reading plans management
│   │   ├── ReadingPlanNew.tsx  # Create reading plan
│   │   ├── SharedNote.tsx      # Public shared notes
│   │   └── ...
│   └── types/                  # TypeScript types
├── public/
│   ├── icons/                  # PWA icons
│   └── data/                   # Large JSON data files
│       └── cross-refs/         # 66 book-specific cross-ref files
├── scripts/                    # Build & data scripts
│   └── backup-firestore.mjs    # Firestore backup
├── .env                        # Environment variables
├── firebase.json               # Firebase config
├── firestore.rules             # Security rules
├── vite.config.ts              # Vite + PWA config
└── package.json
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd scriptorium-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase (required)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Push Notifications (required for notifications)
VITE_FIREBASE_VAPID_KEY=your-vapid-key

# ESV API (optional - for ESV translation)
VITE_ESV_API_KEY=your-esv-api-key

# BibleBrain Audio API (optional)
# Get a free API key at: https://4.dbt.io/api_key/request
VITE_BIBLE_BRAIN_KEY=your-bible-brain-api-key

# Security & Monitoring (optional but recommended)
# VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
# VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password + Google)
4. Create Firestore database

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for groups, authenticated write
    match /groups/{groupId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Deploy to Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🗂️ Key Files

### `src/data/biblicalEras.ts`
Contains the complete 502-day reading plan with:
- Day number and title
- Scripture references
- Era assignment
- Discussion prompts
- Prayer focus
- Key themes
- Cross references
- Auto-tags for journaling

### `src/pages/paths/ChronologicalPath.tsx`
The main reading interface featuring:
- Era-based navigation
- Progress tracking
- Bible text fetching (KJV via bible-api.com)
- Mark complete functionality
- Discussion and prayer integration

### `src/lib/firestore.ts`
Firestore CRUD operations for:
- Journal entries
- Prayer requests
- Reading progress
- User settings

---

## 🎨 Theming

Dark mode is implemented using Tailwind's class strategy:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

Colors are defined in `tailwind.config.js` and use CSS variables for easy customization.

---

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly controls
- Optimized reading experience

---

## 🔐 Authentication

Firebase Authentication supports:
- **Google Sign-In** - One-click authentication
- **Email/Password** - Traditional credentials
- **Protected Routes** - Automatic redirects for unauthenticated users
- **Persistent Sessions** - Stay logged in across visits

---

## 📊 Data Models

### Reading Progress
```typescript
interface ReadingProgress {
  day: number
  completed: boolean
  completedAt?: Date
  notes?: string
}
```

### Journal Entry
```typescript
interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Prayer Request
```typescript
interface Prayer {
  id: string
  content: string
  answered: boolean
  createdAt: Date
  answeredAt?: Date
}
```

---

## 🚢 Deployment

The app is deployed on Firebase Hosting:

```bash
# Build and deploy
npm run build && firebase deploy --only hosting
```

**Live URL**: https://scriptorium-bible-app.web.app

---

## 🛣️ Roadmap

### ✅ Completed
- [x] PWA with offline support (Service Worker + IndexedDB)
- [x] Push notifications for daily readings (Firebase Cloud Messaging)
- [x] Audio Bible integration (BibleBrain API)
- [x] Reading streaks & achievements (22 badges)
- [x] Cross-references panel (Treasury of Scripture Knowledge)
- [x] Commentary integration (Matthew Henry's Concise)
- [x] Word Study (Greek & Hebrew lexicons)
- [x] Interlinear Bible view
- [x] Creeds & Confessions library
- [x] Church Fathers / Patristic quotes
- [x] Biblical Timeline
- [x] Hymnal
- [x] People & Places of the Bible
- [x] Firebase App Check (API protection)
- [x] Sentry error tracking
- [x] Firebase Analytics
- [x] Firestore security rules
- [x] Scriptorium Pulse theological diagnostic
- [x] Guest authentication (Continue as Guest)
- [x] Study notes sharing (public/private/link-only visibility)
- [x] Export journal to PDF (single & batch export with jsPDF)
- [x] Community annotations on verses (notes, insights, questions, prayers)
- [x] Advanced search (fuzzy matching, filters, Bible reference parsing)
- [x] User-created reading plans (custom plans with templates)
- [x] Social features (following, activity feed, verse sharing)
- [x] Accessibility improvements (dyslexic font, line spacing, high contrast, screen reader mode, enhanced focus indicators)
- [x] Enhanced cross-references (verse text preview, OT/NT filters, parallel passage detection, sorting options)
- [x] STEPBible morphology integration (Greek/Hebrew grammatical codes)
- [x] Biblical family trees (2,826 people from STEPBible TIPNR)
- [x] Expanded cross-references (30,412 verses with 396,062 references from MetaV)

### 🚧 In Progress
- [ ] More Bible translations (NIV, ESV, NASB)
- [ ] Multi-language support

### 📋 Planned
- [ ] Sermon preparation tools
- [ ] Bible memory verse tracker with spaced repetition
- [ ] Reading plan templates (30-day, 90-day, etc.)
- [ ] Daily devotional content integration
- [ ] In-app tutorials and onboarding

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for personal/educational use. Contact the maintainer for licensing questions.

---

## 🙏 Acknowledgments

- Bible text from [bible-api.com](https://bible-api.com/) (KJV)
- Cross-references from [josephilipraja/bible-cross-reference-json](https://github.com/josephilipraja/bible-cross-reference-json) (GPL-2.0, credit: SoulLiberty/MetaV)
- Treasury of Scripture Knowledge cross-references
- STEPBible data (morphology, people, versification) from [STEPBible-Data](https://github.com/STEPBible/STEPBible-Data) (CC BY 4.0)
- Icons from [Lucide](https://lucide.dev/)
- Hosting by [Firebase](https://firebase.google.com/)

---

**Built with ❤️ for deeper Bible study**

---

## 💡 Future Enhancement Ideas

- Expand Bible translation options (NIV, ESV, NASB, etc.)
- Provide multi-language support for international users
- Integrate more audio versions and languages
- Add verse memorization tools with spaced repetition
- Implement sermon preparation workspace
- Create Bible study templates for small groups
- Add daily devotional content integration
- Build in-app tutorials and onboarding for new users
# react-scriptorium
