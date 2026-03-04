# ToDoGTD Implementation Plan

## Overview
ToDoGTD is a high-fidelity productivity application inspired by Things 3, but enhanced with data visualization, collaboration features, and voice commands.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS (Glassmorphism)
- **State Management**: Zustand
- **Visuals**: Recharts + Framer Motion
- **Infrastructure**: Web Speech API (Voice Recognition)

## Layered Architecture
The project follows a clean, layered architecture to ensure scalability and maintainability:

1.  **Domain Layer (`/src/domain`)**:
    - Core entities: `Task`, `Project`, `User`.
    - Business types and interfaces.
2.  **Application Layer (`/src/application`)**:
    - Zustand store (`useStore.ts`) managing global state (Tasks, Projects, Voice status).
    - Business rules and state transitions.
3.  **Infrastructure Layer (`/src/infrastructure`)**:
    - `VoiceService.ts`: Integration with browser-native APIs for speech recognition.
    - Future proofing for API adapters and external services.
4.  **UI Layer (`/src/components` & `/src/app`)**:
    - **Atoms/Molecules**: Small, reusable units like `ProductivityPulse`.
    - **Organisms**: Complex structures like `Sidebar`, `TaskList`, and `VoiceOverlay`.
    - **Pages**: Top-level route components for Dashboard and Insights.

## Key Features Implemented
- [x] **Premium UI**: Deep Navy dark mode with glassmorphic elements.
- [x] **Visual Dashboard**: Productivity Pulse area chart.
- [x] **Interactive Task List**: Delightful animations and status management.
- [x] **Productivity Insights**: Gauge charts, Pie charts, and Milestone Journeys.
- [x] **Voice Commands**: Real-time transcription and basic natural language parsing.

## How to Run
1.  Run `npm install` to ensure all dependencies are set.
2.  Run `npm run dev` to start the development server.
3.  Navigate to `http://localhost:3000`.
4.  Experience the **Magic Voice** button in the bottom right!
