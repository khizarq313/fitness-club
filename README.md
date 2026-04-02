# 🏋️‍♂️ Fitness Club PWA

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-success)

A premium, production-ready Progressive Web App (PWA) built from scratch for elite fitness clubs and gyms. Engineered with **React 18, TypeScript, Tailwind CSS, and Firebase**, featuring brutalist design aesthetics, digital contract signatures, and offline capabilities.

---

## ✨ Key Features

### 🏢 Member & Club Features
- **Elite UI/UX:** Dark "True Black & Gold" theme with sharp brutalist edges and Framer Motion animations.
- **Dynamic Memberships & Offers:** Real-time pricing tiers and limited-time campaigns fetched from Firestore.
- **Master Coaches & Gallery:** Masonry grids and interactive flip-cards for staff and facility tours.
- **Client Echoes (Reviews):** Authentic user reviews with a custom 5-star rating pipeline.
- **WhatsApp Integration:** Direct-to-WhatsApp routing for package inquiries and bookings.

### 📝 Digital Waivers & Forms
- **E-Signatures:** Built-in `<SignaturePad>` for legally binding digital signatures.
- **PAR-Q Form:** Physical Activity Readiness Questionnaire.
- **PT Contracts & Trial Waivers:** Fully digitized liability waivers saving directly to the database.
- **Strict Validation:** Form handling powered by `react-hook-form` and `zod`.

### ⚡ PWA & Performance
- **Installable App:** App-like mobile experience with custom icons and splash screens.
- **Offline Support:** Workbox runtime caching for images, fonts, and core assets.
- **Optimized Bundle:** Lazy-loaded routes (`React.lazy`) and Suspense for lightning-fast initial loads.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 18, TypeScript, Vite 5
- **Styling:** Tailwind CSS v3, PostCSS
- **Animations:** Framer Motion v11
- **State Management:** Zustand v4
- **Backend as a Service (BaaS):** Firebase v10 (Authentication & Firestore)
- **Forms & Validation:** React Hook Form v7, Zod v3
- **Signatures:** `react-signature-canvas`
- **PWA:** `vite-plugin-pwa`

---

## 📂 Project Structure

```bash
fitness-club-pwa/
│── public/             # PWA icons, manifest, and static assets
│── src/
│   ├── components/     # UI, Layout, and Section components
│   ├── hooks/          # Custom hooks (e.g., useFirestoreData)
│   ├── lib/            # Firebase config and utility libraries
│   ├── pages/          # Route pages (Home, Login, PAR-Q, Waivers)
│   ├── stores/         # Zustand state stores (authStore)
│   ├── types/          # TypeScript interfaces
│   ├── App.tsx         # Main router and Suspense boundary
│   └── main.tsx        # React entry point
│── .env                # Environment variables
│── tailwind.config.ts  # Custom theme tokens
│── vite.config.ts      # Vite & PWA configuration
└── package.json
```

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/fitness-club-pwa.git](https://github.com/your-username/fitness-club-pwa.git)
cd fitness-club-pwa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the development server
```bash
npm run dev
```

---

## 🗄️ Firebase Firestore Setup

This app requires specific Firestore collections to function dynamically. Create the following collections in your Firebase Console:

1. `packages` (Fields: name, price, durationDays, isActive, order)
2. `trainers` (Fields: name, role, bio, imageUrl, order)
3. `reviews` (Fields: reviewerName, reviewText, rating, isVisible, createdAt)
4. `gallery` (Fields: imageUrl, caption, order)
5. `offers` (Fields: title, description, discountText, isActive)

*Note: The app will write to `parq`, `pt_contracts`, and `trial_waivers` automatically upon form submissions.*

---

## 🧪 Build for Production

To create an optimized, production-ready build with PWA service workers generated:

```bash
# Check TypeScript types
npm run typecheck

# Build the project
npm run build

# Preview the production build locally
npm run preview
```

---

## 👨‍💻 Author

**Khizar Qureshi** *Full-Stack Engineer & UI/UX Specialist*

---

## ⭐ Support
If you find this project useful for learning or business, please give it a ⭐ on GitHub!
```