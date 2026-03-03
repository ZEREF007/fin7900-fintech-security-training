# FIN7900 FinTech Security Training Platform

An interactive cybersecurity training web application built for FIN7900 Individual Assignment. Covers data breaches, FinTech regulations, cybersecurity concepts, and best practices for financial technology professionals.

## Features

- 5 learning modules covering data breaches, FinTech laws, phishing, social engineering, and incident response
- Interactive quiz with randomized questions
- Security awareness game
- Personal progress dashboard
- Plain-English glossary of cybersecurity terms
- Regulatory references (GDPR, PCI-DSS, SOX, CCPA, GLBA)
- Dark and light mode
- Fully responsive design

## Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion  
**Backend:** Node.js + Express + better-sqlite3 + JWT authentication  
**Database:** SQLite (WAL mode)

## Local Development

```bash
# Install backend dependencies
npm install

# Install and build frontend
cd client && npm install && npm run build && cd ..

# Start server
node server.js
# Open http://localhost:3000
```

## Deployment (Render)

This project includes a `render.yaml` for one-click deployment to [Render](https://render.com):

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and configure the service
5. Add a `JWT_SECRET` environment variable (or let Render generate one)
6. Click Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes (production) |
| `NODE_ENV` | Environment (`production`) | Recommended |

## Project Structure

```
├── client/          React + TypeScript source
│   ├── src/
│   │   ├── components/   Navbar, QuickTips, ThemeContext
│   │   └── pages/        12 page components
│   └── vite.config.ts
├── public/          Built frontend (output of vite build)
├── server.js        Express API + static file server
├── package.json
└── render.yaml      Render deployment config
```

---

*FIN7900 Individual Assignment — FinTech Security Training Platform*
