# ShopLab — Testing Research App

A full-stack web application built as a test subject for the research paper:
**"Manual Testing vs Test Automation: An Empirical Analysis of Cost, Time, and Software Quality"**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| AI Chatbot | Google Gemini 1.5 Flash |

---

## Project Structure

```
testing-research-app/
├── backend/              # Express API
│   ├── config/           # DB connection
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route handlers
│   ├── middleware/       # JWT auth middleware
│   ├── server.js         # Entry point
│   ├── seed.js           # Sample data seeder
│   └── .env              # Environment variables
├── frontend/             # React + Vite app
│   └── src/
│       ├── api/          # Axios instance
│       ├── context/      # Auth + Cart state
│       ├── pages/        # Login, Register, Products, Cart, Dashboard
│       └── components/   # Navbar, ProductCard, ChatBot, ProtectedRoute
└── tests/                # Test documentation
    ├── manual_test_cases.md
    ├── selenium_test_scenarios.md
    ├── regression_test_plan.md
    └── chatbot_test_cases.md
```

---

## Prerequisites

- Node.js >= 18
- MongoDB running locally on `mongodb://localhost:27017`
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

---

## Setup & Run

### 1. Clone / open the project

```bash
cd /path/to/testing-research-app
```

### 2. Configure the backend

```bash
cd backend
```

Open `.env` and replace `your_gemini_api_key_here` with your actual key:

```
MONGO_URI=mongodb://localhost:27017/testing-research
JWT_SECRET=myresearchappsecret2024
GEMINI_API_KEY=your_actual_key_here
PORT=5000
```

### 3. Install backend dependencies + seed data

```bash
npm install
node seed.js        # Seeds 8 products into MongoDB
```

### 4. Start the backend

```bash
node server.js
# Output: Server running on port 5000 | MongoDB connected
```

### 5. Install and start the frontend (new terminal)

```bash
cd ../frontend
npm install
npm run dev
# Output: Local: http://localhost:5173/
```

### 6. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/products | No | List products (supports ?search= ?category=) |
| GET | /api/products/:id | No | Single product |
| POST | /api/products | No | Create product |
| POST | /api/orders | JWT | Place an order |
| GET | /api/orders | JWT | Get user's orders |
| POST | /api/chatbot/message | No | Send message to Gemini AI |
| GET | /api/health | No | Health check |

---

## Intentional Bugs (For Research Testing)

These defects are **deliberately left in place** for testing research purposes.

| Bug ID | Location | Description | Test Type |
|--------|----------|-------------|-----------|
| BUG-01 | `backend/routes/auth.js` | Loose email regex — accepts emails without TLD (e.g., `a@b`) | Boundary / Validation |
| BUG-02 | `frontend/src/pages/Register.jsx` | Confirm-password mismatch shown only on submit, not inline | UI/UX Testing |
| BUG-03 | `frontend/src/context/CartContext.jsx` | qty=0 does not auto-remove item from cart | Boundary Value |
| BUG-04 | `frontend/src/pages/Cart.jsx` | Quantity controls overflow their container on screens < 480px | UI/UX / Responsive |
| BUG-05 | `backend/routes/chatbot.js` | No timeout on Gemini API call — slow responses leave UI loading indefinitely | Chatbot / Delay |

---

## Test Scenarios Available

| File | Contents |
|------|----------|
| `tests/manual_test_cases.md` | 40 structured test cases across all modules |
| `tests/selenium_test_scenarios.md` | 10 Selenium automation scripts with `data-testid` selectors |
| `tests/regression_test_plan.md` | Trigger matrix + P1 regression checklist |
| `tests/chatbot_test_cases.md` | 25 chatbot test cases including delay and error scenarios |

---

## Default Test Account

After running `node seed.js`, register a new account via the UI — no default users are seeded for security.

---

## Notes for Research Paper

- All testable elements have `data-testid` attributes for Selenium targeting
- Products, orders, and auth are separated into discrete API modules for modular testing
- The chatbot is a real AI integration, not a stub, for realistic latency testing
- All intentional bugs are commented in source code with `BUG-0X (intentional):` markers
