# 🚗 Cab Company Expense Tracker

A full-stack expense tracking application for managing cab company expenses.

## 🏗️ Project Structure

```
expense-tracker/
├── frontend/           # Astro.js app
│   ├── pages/
│   ├── components/     # shadcn/ui components using React
│   └── public/
├── backend/            # Haskell (Servant) API
│   ├── app/            # Main.hs
│   ├── src/            # Api.hs, Models.hs, Handlers.hs
│   ├── config/         # SQL or migration files
│   ├── Dockerfile
│   └── package.yaml
├── shared/             # Shared types/constants
└── .env.example        # For local environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Stack (Haskell tool)
- PostgreSQL
- Docker (optional)

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
3. Start the backend:
   ```bash
   cd backend
   stack build
   stack run
   ```
4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🛠️ Tech Stack

### Frontend

- Astro.js
- React (islands)
- shadcn/ui
- Tailwind CSS
- TypeScript

### Backend

- Haskell
- Servant
- PostgreSQL
- Beam/Persistent

## 📝 License

MIT
