# Disha

**Find the financial assistance that fits your journey.**

A prototype built for **Smart India Hackathon — Problem Statement SIH26092**:
*"AI-Driven Scheme Matching for Marginalized Entrepreneurs"*, for the
**Ministry of Social Justice and Empowerment**, Department of Social Justice
and Empowerment (Theme: Smart Automation).

> ⚠️ **This is a prototype for SIH demonstration only.** It does not approve
> loans, does not officially verify government eligibility, and is not
> connected to any live government API. Wherever the system performs
> preliminary matching it uses the phrase **"Potentially Eligible"**, never
> "Eligible."

---

## 1. Problem Statement

Marginalized entrepreneurs — particularly SC beneficiaries — often struggle to
discover which government financial assistance / credit schemes they may
qualify for, understand the financial implications, prepare the right
documents, and find the correct channel partner to apply through. Disha
is a multilingual digital platform that helps beneficiaries navigate this
journey end-to-end, from discovery to (simulated) application tracking.

## 2. Features

- **Multi-step onboarding** capturing personal, business and financial details
- **Backend-only matching engine** producing `POTENTIALLY_ELIGIBLE` /
  `NEEDS_MORE_INFORMATION` / `NOT_MATCHED` verdicts with a **Prototype Match
  Indicator** (never presented as an official score)
- **Match explanation** — "Why this scheme matched" / "Things you still need
  to verify"
- **Scheme details** with full financial terms, documents, and verified
  source information
- **Scheme comparison** — factual, side-by-side, no "best scheme" claims
- **Scheme-aware EMI calculator**
- **Document checklist** with self-reported **Document Readiness** (explicitly
  not "Government Verification") and prototype file upload
- **Channel Partner Locator** — Leaflet/OpenStreetMap map, Haversine-based
  distance ranking, clearly labeled **Prototype / Admin-verified dataset**
- **Application tracking** — explicitly simulated, no live government API
- **Grounded AI assistant** — explains scheme data and match results using
  only what exists in the database; it never determines eligibility and never
  invents rates, limits, or rules
- **Full Admin Dashboard** — Scheme CRUD, Eligibility Rule CRUD, Channel
  Partner CRUD, Document type CRUD, Scheme Update History / audit trail,
  Source Re-verification, Activate/Deactivate, User Match Monitoring,
  Application overview
- **Multilingual UI** — English, Hindi, Telugu (i18next / react-i18next)

## 3. Architecture

```
disha/
├── backend/     Node.js + Express + MongoDB (Mongoose) REST API
└── frontend/    React + Vite + Tailwind CSS SPA
```

The **matching engine lives entirely on the backend**
(`backend/utils/matchingEngine.js`). The React frontend never evaluates
eligibility itself — it only renders what the API returns.

## 4. Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React,
Recharts, Leaflet + React Leaflet, i18next / react-i18next

**Backend:** Node.js, Express.js, MongoDB (Mongoose ODM — the only database),
JWT auth, bcrypt, dotenv, CORS, Multer (prototype document uploads)

## 5. MongoDB Collections

`users`, `schemes`, `eligibilityrules`, `documenttypes` / `userdocuments`,
`channelpartners`, `applications`, `schemeupdates`, `savedschemes`

## 6. Matching Engine

For every **active** scheme, all **active** eligibility rules are evaluated
against the beneficiary's input (`category`, `age`, `annualIncome`, `state`,
`district`, `residenceType`, `educationStatus`, `businessType`,
`businessActivity`, `newOrExistingBusiness`, `projectCost`, `loanRequired`,
`previousLoanHistory`, etc.) using operators `==`, `!=`, `>`, `>=`, `<`, `<=`,
`IN`, `NOT_IN`, `BETWEEN`.

- All **mandatory** rules pass → `POTENTIALLY_ELIGIBLE`
- A mandatory rule can't be evaluated (missing input) → `NEEDS_MORE_INFORMATION`
- Any mandatory rule fails → `NOT_MATCHED`
- **Conditional** rules add warnings/notes but don't block eligibility
- **Informational** rules are always surfaced as notes only

The returned `matchPercentage` is labeled the **"Prototype Match Indicator"**
and is never presented as an official eligibility score.

## 7. Partner Routing

Given a user's coordinates, an optional scheme, and required loan amount, the
API filters channel partners that are active, support the scheme, and have a
compatible partner type, then ranks them by **Haversine distance**. Results
are always labeled "Suitable nearby channel partners" — never "best."

## 8. Data Sources & Verification

All seeded scheme data is sourced from **official government portals**:

- NSFDC — https://nsfdc.nic.in/
- NSFDC FAQs — https://nsfdc.nic.in/faqs
- Department of Financial Services — https://financialservices.gov.in/
- PMMY — https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy
- Stand-Up India — https://financialservices.gov.in/stand-india-scheme-supi
- myScheme — https://www.myscheme.gov.in/

Every scheme record stores `officialSourceUrl`, `sourceName`, `lastVerifiedAt`,
`version`, and `status`, all displayed on the scheme detail page. NSFDC
schemes are the primary focus of this prototype; **PMMY and Stand-Up India are
clearly marked as additional government financing schemes and are not
represented as NSFDC schemes.**

> Scheme figures (loan ranges, interest rate descriptions, repayment periods)
> are illustrative prototype data compiled for this demonstration and must be
> revalidated against the official sources above before any real-world use.

## 9. How to Run Locally

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGODB_URI / JWT_SECRET as needed
npm run seed               # seeds schemes, rules, documents, partners, admin user
npm run dev                # starts the API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # starts the SPA on http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api` by default
(override with `VITE_API_URL` in a `frontend/.env` file).

## 10. Environment Variables (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (database name: `Disha`) |
| `PORT` | API port (default 5000) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by the seed script to create the local demo admin |
| `CLIENT_ORIGIN` | Allowed CORS origin (default `http://localhost:5173`) |

## 11. Seed / Demo Credentials

After running `npm run seed` in `backend/`:

- **Admin:** `admin@disha.gov.in` / `Admin@12345` (or whatever you set in `.env`)
- **Demo beneficiary:** `demo.user@disha.gov.in` / `Demo@12345`

Seeded data: 7 schemes, eligibility rules per scheme, 10 document types, 10
demo channel partners (clearly labeled prototype data).

## 12. API Overview

| Area | Base path |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Profile | `GET/PUT /api/users/profile` |
| Schemes | `GET /api/schemes`, `GET /api/schemes/:id`, `GET /api/schemes/compare?ids=`, admin CRUD under `/api/schemes` |
| Eligibility Rules | `/api/eligibility-rules` (admin only) |
| Matching | `POST /api/match` (profile-based), `POST /api/match/preview` (stateless) |
| Channel Partners | `GET /api/partners`, `POST /api/partners/nearby`, admin CRUD |
| Documents | `GET /api/documents/types`, `GET/PATCH /api/documents/checklist/:schemeId`, `POST /api/documents/upload/:schemeId` |
| Applications | `/api/applications` (user), `/api/applications/admin/all` (admin) |
| Saved Schemes | `/api/saved-schemes` |
| Calculator | `POST /api/calculator/emi` |
| AI Assistant | `/api/ai/scheme/:id`, `/api/ai/match`, `/api/ai/documents/:id`, `/api/ai/term` |
| Admin Dashboard | `GET /api/admin/summary`, `GET /api/admin/user-matches` |

Full route definitions are in `backend/routes/`.

## 13. Test Scenarios

1. Register a new user → complete onboarding as an SC beneficiary, age 28,
   income ₹1.8L, wants a ₹75,000 tailoring loan → expect NSFDC Micro Finance
   and Aajeevika Micro-Finance as `POTENTIALLY_ELIGIBLE`.
2. Same profile but loan required ₹5,00,000 → expect NSFDC Term Loan or
   Udyam Nidhi to surface instead; PMMY also matches (no category
   restriction).
3. Log in as admin → deactivate a scheme → confirm it disappears from
   `/schemes` and matching results, and the change appears in Scheme Update
   Management.
4. Use the Channel Partner Locator with geolocation denied (default
   coordinates) → confirm nearby SCA/PSB/RRB partners appear, sorted by
   distance, each labeled with its data source.
5. Run the EMI calculator with a selected scheme → confirm scheme context
   (max loan, interest info, repayment period, moratorium) displays alongside
   the estimate.
6. Switch language to Hindi / Telugu via the navbar → confirm landing page,
   navigation and status labels update.

## 14. Prototype Limitations

1. The platform provides **preliminary scheme matching only**.
2. It does **not guarantee loan approval**.
3. Final eligibility is determined by the concerned authority or channel
   partner.
4. Channel partner financial/operational status (fund utilization, overdue
   status) is **not live data** — it is prototype/demo data unless a real API
   is integrated.
5. All demo partner records are clearly labeled **prototype data**.
6. Application tracking is **simulated** — no official government API is
   connected.
7. All scheme information must be **revalidated against official sources**
   before real-world use.

## 15. Future Scope

- Live integration with NSFDC / PMMY / Stand-Up India data feeds where APIs
  become available
- Real-time channel partner fund utilization and NPA data via authorized
  integration
- Official application-status tracking via government API integration
- A production LLM integration for the AI assistant, still constrained to
  answer only from verified scheme data
- Additional regional languages
- SMS/WhatsApp-based access for low-connectivity users
