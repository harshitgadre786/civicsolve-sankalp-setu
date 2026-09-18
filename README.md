# CivicSolve / Sankalp Setu (SIH26043)

> **Submission for Smart India Hackathon — Problem Statement SIH26043**  
> *Government of Jharkhand: A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.*

---

## Overview

**CivicSolve (Sankalp Setu)** bridges the gap between citizens reporting grassroots issues, higher educational institutions (HEIs) researching and engineering solutions, and corporate industry/CSR bodies providing mentorship, funding, and deployment capacity.

The platform is designed around the 10-screen visual reference system:
1. **Dashboard** — Live KPI metrics, challenge activity area chart, interactive Leaflet problem map of Jharkhand districts, and recent challenges table.
2. **Challenges Directory** — Filterable grid by sector (Environment, Healthcare, Education, Agriculture, Infrastructure, Water & Sanitation, Rural Livelihoods), sortable by latest/supporters/priority, with "+ Post a Challenge" modal supporting image upload and real-time AI categorization.
3. **Challenge Details** — In-depth view featuring problem description, live support counter toggle, multi-tab layout (Overview, AI Analysis, Collaborators, Comments discussion feed).
4. **Solutions Showcase** — Active collegiate prototypes with progress bars, team member badges, views count, status filters (In Progress, Testing, Deployed / Live), and "+ Submit Solution" flow.
5. **Partner Universities Directory** — Profiles of leading Jharkhand and national HEIs (BIT Sindri, IIT ISM Dhanbad, NIT Jamshedpur, Birsa Agricultural University, IIT Delhi, IISc Bangalore) with departmental tags, active projects, and NIRF rankings.
6. **Industry Partners Directory** — Corporate CSR and enterprise directories (Tata Steel CSR, TCS Foundation, Infosys Springboard, Reliance Jio, HDFC Bank Parivartan, Tata Motors, Wipro) with direct engagement proposal dispatch.
7. **Active Teams** — Multi-disciplinary student and faculty rosters with skills tags, member counts, and team creation modal.
8. **AI Matching Engine** — Intelligent semantic matcher that analyzes any problem statement and computes ranked match percentages with natural language reasoning across Universities, Industry Partners, and Student Teams.
9. **Impact Analytics (Government Portal)** — Aggregated societal impact metrics: people reached (2.4M+), solutions deployed, impact trend area chart, sector allocation donut chart, top impacted districts bar chart, and CSV export.
10. **Profile & Settings** — User account management, skills taxonomy, notification preference toggles, and notification activity feed.

---

## Visual Design System & Aesthetics

- **Visual Tokens**: Matches the ChallengeFlow design reference exactly:
  - Sidebar: `#071412` (near-black deep teal)
  - Active Nav Item: `#1F2927`
  - Accent / Primary Brand: `#16AF82` (emerald green)
  - Light Accent: `#DDF2E7`
  - App Background: `#F5F6F4`
  - Card Surfaces: `#FFFFFF` with borders `#E7EBE8`
  - Status Indicators: Red `#DC2626` (High Priority), Amber `#D97706` (Medium / In Progress), Blue `#0284C7` (Testing), Green `#16AF82` (Deployed / Live).
- **Typography**: Inter typography hierarchy.
- **Emoji Free**: Strictly zero emojis utilized across all UI copy, buttons, badges, and headers, adhering to enterprise design specifications.

---

## AI Architecture & Services

The AI layer (`server/src/services/aiService.ts`) operates autonomously in two distinct modes:

### 1. Offline Deterministic Embedding & Classification Engine (Default Mode)
- **Domain Auto-Categorization**: Evaluates challenge title and text descriptions using domain keyword taxonomies and weighted frequency vectors, returning confidence scores and categorized sectors (Agriculture, Healthcare, Environment, etc.).
- **Skill Extraction**: Automatically parses problem statements to recommend technical skills needed (e.g. IoT, AI/ML, Agronomy, Civil Engineering, Embedded Systems).
- **Duplicate Detection via Cosine Similarity**: Uses n-gram TF-IDF frequency vectors to calculate semantic cosine similarity against existing challenges in the same district. Flags potential duplicates (e.g., >65% similarity) with the specific matched challenge ID and similarity index.
- **Weighted Multi-Entity Match Scoring**: Computes compatibility percentages (0-100%) between problem parameters and university/industry/team capability tags, generating clear natural-language rationale explaining the match.

### 2. Gemini LLM API (Online Mode)
- When a valid `GEMINI_API_KEY` is provided in `server/.env`, the system upgrades to full LLM generation while maintaining the exact same API contract. The `/api/health` endpoint explicitly reports the active engine.

---

## Project Structure

```text
c:\Sih\
├── client/                     # Vite + React 18 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── api/client.ts       # Axios client with JWT interceptor & typed methods
│   │   ├── components/         # Persistent Sidebar, Topbar, Modals
│   │   ├── context/            # AuthContext with testing role switcher
│   │   ├── pages/              # 10 full-feature screens matching mockup
│   │   └── types/              # TypeScript models
│   ├── tailwind.config.js      # Custom palette tokens matching visual reference
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma       # Relational models: Users, Challenges, Solutions, etc.
│   │   ├── seed.ts             # Realistic Jharkhand district seed dataset
│   │   └── dev.db              # SQLite zero-friction relational database
│   ├── src/
│   │   ├── controllers/        # REST controllers (auth, challenges, matching, etc.)
│   │   ├── middleware/         # JWT auth & optional auth
│   │   ├── routes/api.ts       # Express API router & health check
│   │   ├── services/           # aiService.ts (Classifier & Matcher), uploadService.ts
│   │   └── index.ts            # Server entrypoint
│   ├── uploads/                # Local storage for uploaded challenge photos
│   └── package.json
│
└── README.md
```

---

## Quick Start & Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Run the Full Stack App
To start the backend API server:
```bash
cd server
npm install
npm run prisma:push
npm run seed
npm run dev
```
The server will start on: **`http://localhost:5000`**  
Health Check: **`http://localhost:5000/api/health`**

To start the frontend client:
```bash
cd client
npm install
npm run dev
```
The client application will start on: **`http://localhost:5173`**

---

## Pre-seeded Testing Accounts & Roles

You can switch between any role instantly using the **Role Switcher** dropdown in the top bar:

| Role | Name | Email | Organization |
| :--- | :--- | :--- | :--- |
| **Citizen / Student** | Harshit Gadre | `harshitgadre706@gmail.com` | Ranchi, Jharkhand |
| **University Mentor** | Prof. R. K. Sharma | `admin@bitsindri.ac.in` | BIT Sindri |
| **Industry Partner** | Priya Nair | `priya.nair@tatasteel.com` | Tata Steel CSR Foundation |
| **Government Official** | Dr. Amit Verma, IAS | `director.planning@jharkhand.gov.in` | Dept of Higher Education, GoJ |

*Default password for all seeded users:* `password123`

---

## Complete User Journey Tested

1. **Citizen Posts a Challenge**: Submits "Severe groundwater drawdown in Tamar village". The AI automatically categorizes it as `Water & Sanitation` with 94% confidence, recommends required skills (`IoT`, `Environmental Science`), and scans for regional duplicates.
2. **Community Upvote**: Upvotes increase the real counter in the database.
3. **University Explores AI Matching**: University faculty enters a problem statement and receives ranked match recommendations (`Birsa Agricultural University: 92% Match`, `BIT Sindri: 88% Match`) with natural-language reasoning.
4. **Team & Solution Registration**: University students create a cross-disciplinary team (`Green Innovators`) and publish the prototype (`Smart Irrigation System`).
5. **Corporate CSR Engagement**: Industry partner (`Tata Steel CSR`) reviews the solution and commits funding and solar equipment.
6. **Government Impact Analytics**: Real-time aggregation reflects 2.4M beneficiaries reached, district breakdowns (Ranchi 26%, Dhanbad 22%), and CSV export capabilities.
