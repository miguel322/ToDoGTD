# ToDoGTD | Visual Task Management & GTD 🚀

**ToDoGTD** is a premium, high-fidelity productivity application inspired by Things 3, but enhanced with powerful data visualization, clean architecture, and voice-first interactions.

![ToDoGTD Preview](https://via.placeholder.com/1200x600/1a1f2e/ffffff?text=ToDoGTD+Visual+Task+Management) (Replace with a real screenshot soon!)

## ✨ Features

- **💎 Premium UI/UX:** A stunning dark mode interface with glassmorphic elements and smooth Framer Motion animations.
- **📊 Visual Dashboard:** Real-time productivity tracking with the "Productivity Pulse" area chart and detailed "Insights" page.
- **🎙️ Voice-First Interaction:** Create tasks and navigate the app using natural language thanks to the integrated Web Speech API.
- **🔥 Real-time Sync:** Powered by Firebase Firestore for seamless data persistence across sessions.
- **🏗️ Clean Architecture:** Organized into Domain, Application, Infrastructure, and UI layers for maximum maintainability.
- **📱 Responsive Design:** Fully optimized for both desktop and mobile experiences.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS (Glassmorphism)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Visualizations:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Backend:** [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Voice Service:** Web Speech API

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites
- Node.js 18.x or higher
- A Firebase Project (for Auth and Firestore)

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/miguel322/ToDoGTD.git
cd ToDoGTD
```

Install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```
*(You can use `.env.local.example` as a template)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📂 Project Structure

- `src/domain`: Core business logic and types.
- `src/application`: State management (Zustand) and custom hooks.
- `src/infrastructure`: External service integrations (Firebase, Voice API).
- `src/components`: UI components organized by complexity (Atoms, Molecules, Organisms).
- `src/app`: Page routes and layouts.

## 🤝 Contributing

Feel free to open issues or submit pull requests to help improve ToDoGTD!

## 📄 License

This project is licensed under the MIT License.
