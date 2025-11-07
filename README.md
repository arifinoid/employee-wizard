# Employee Wizard - Frontend Assignment

An employee onboarding system with role-based access, async processing, and responsive design.

## ✨ Features

### Core Functionality
- **Role-based Wizard**: Admin (Steps 1+2) vs Ops (Step 2 only)
- **Async Autocomplete**: Department & Location search with `name_like` queries
- **File Upload**: Image preview with Base64 conversion
- **Auto-generated IDs**: Format `<DEPT>-<SEQ>` (e.g., `ENG-003`)
- **Draft Auto-save**: Debounced localStorage every 2 seconds
- **Bulk Async Submit**: Sequential POSTs with 3s delays & progress logs
- **Employee Directory**: Merged data with pagination (`_page`, `_limit`)

### Technical Excellence
- **Responsive Design**: 360px–1440px with mobile-first approach
- **Clean Architecture**: Modular components, custom hooks, TypeScript
- **Vanilla CSS**: BEM methodology, no frameworks (Tailwind, Bootstrap, etc.)
- **Testing**: Jest + RTL (2+ tests for autocomplete & submit flow)
- **Mock APIs**: Docker Compose with json-server (ports 4001/4002)
- **Atomic Commits**: Feature-by-feature Git history

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for mock APIs)

### 1. Start Mock APIs
```bash
docker compose up -d

2. Install & Run

```bash
npm install
npm run dev
```
Open: http://localhost:3000

3. Testing
```bash
npm test
```

## 🏗️ Project Structure
```text
employee-wizard/
├── src/
│   ├── components/     # Reusable UI (Autocomplete, FileUpload)
│   ├── hooks/          # Custom logic (useFormDraft, useAsyncSubmit)
│   ├── pages/          # Route components (WizardPage, EmployeeListPage)
│   ├── services/       # API & utility logic
│   ├── types/          # TypeScript interfaces
│   ├── styles/         # BEM CSS modules
│   └── routes/         # React Router setup
├── json-server/        # Mock API data files
├── docker-compose.yml  # API container orchestration
├── tests/              # Jest + RTL test suite
└── README.md           # This file
```