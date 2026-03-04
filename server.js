/**
 * FIN7900 Training Platform — Backend Server
 * Express + better-sqlite3 + bcryptjs + JWT
 * Run: node server.js (then open http://localhost:3000)
 */

const express  = require('express');
const path     = require('path');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Database = require('better-sqlite3');
const cors     = require('cors');
const https    = require('https');

// ─── Config ────────────────────────────────────────────────
const PORT       = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fin7900-super-secret-key-change-in-prod';
const JWT_EXPIRY = '7d';
const DB_PATH    = path.join(__dirname, 'training.db');

// ─── Database Setup ─────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    email        TEXT    NOT NULL UNIQUE,
    password     TEXT    NOT NULL,
    role         TEXT    NOT NULL DEFAULT 'learner',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS page_visits (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page         TEXT    NOT NULL,
    visited_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, page)
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score        INTEGER NOT NULL,
    total        INTEGER NOT NULL,
    pct          INTEGER NOT NULL,
    passed       INTEGER NOT NULL DEFAULT 0,
    elapsed_sec  INTEGER NOT NULL DEFAULT 0,
    filter       TEXT    NOT NULL DEFAULT 'all',
    taken_at     TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS game_attempts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score        INTEGER NOT NULL,
    correct      INTEGER NOT NULL,
    total        INTEGER NOT NULL,
    max_streak   INTEGER NOT NULL DEFAULT 0,
    rank         TEXT    NOT NULL DEFAULT '',
    played_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS module_videos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id  TEXT    NOT NULL UNIQUE,
    url        TEXT    NOT NULL DEFAULT '',
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS otp_tokens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    NOT NULL,
    code_hash  TEXT    NOT NULL,
    purpose    TEXT    NOT NULL DEFAULT 'login',  -- 'login' | 'reset'
    expires_at TEXT    NOT NULL,
    used       INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS translation_cache (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    source     TEXT    NOT NULL,
    target     TEXT    NOT NULL,
    result     TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(source, target)
  );
`);

// Add last_ip column if it doesn't exist yet (safe migration)
try { db.exec("ALTER TABLE users ADD COLUMN last_ip TEXT DEFAULT ''"); } catch (_) {}

// ─── Startup: ensure admin email is always admin ─────────────
(function ensureAdminEmail() {
  const ADMIN_EMAIL = 'icyace007@gmail.com';
  const user = db.prepare('SELECT id, role FROM users WHERE email = ?').get(ADMIN_EMAIL);
  if (user && user.role !== 'admin') {
    db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(ADMIN_EMAIL);
    console.log(`  ✅  Promoted ${ADMIN_EMAIL} to admin`);
  }
})();

// ─── Express Setup ───────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // serve React build

// ─── JWT Middleware ──────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── Auth Routes ─────────────────────────────────────────────

// Password complexity checker
function validatePassword(password) {
  if (password.length < 8)          return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password))      return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password))      return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return null;
}

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });

  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ error: pwErr });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing)
    return res.status(409).json({ error: 'An account with this email already exists.' });

  // Auto-admin for designated admin email
  const cleanEmail = email.toLowerCase().trim();
  const role = cleanEmail === 'icyace007@gmail.com' ? 'admin' : 'learner';

  const hash = bcrypt.hashSync(password, 12);  // 12 rounds for stronger hashing
  const info = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
                 .run(name.trim(), cleanEmail, hash, role);

  const token = jwt.sign({ id: info.lastInsertRowid, email: cleanEmail, name: name.trim(), role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ token, user: { id: info.lastInsertRowid, name: name.trim(), email: cleanEmail, role } });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password.' });

  // Record last login IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  db.prepare("UPDATE users SET last_ip = ? WHERE id = ?").run(ip, user.id);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// ── OTP helpers ──────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function cleanExpiredOtps() {
  db.prepare("DELETE FROM otp_tokens WHERE expires_at < datetime('now') OR used = 1").run();
}

// POST /api/auth/forgot  — request password-reset OTP
app.post('/api/auth/forgot', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  // Always return same shape (prevent user enumeration)
  if (!user) return res.json({ ok: true, demo_code: null, message: 'If this email exists, a code was sent.' });

  cleanExpiredOtps();
  const code = generateOtp();
  const hash = bcrypt.hashSync(code, 8);
  db.prepare("INSERT INTO otp_tokens (email, code_hash, purpose, expires_at) VALUES (?, ?, 'reset', datetime('now','+10 minutes'))").run(email.toLowerCase().trim(), hash);
  console.log(`  🔑  [RESET OTP] ${email} → ${code}  (expires in 10 min)`);
  // In production: send via email. For demo, include in response.
  res.json({ ok: true, demo_code: code, message: 'Code generated. In production this would be emailed.' });
});

// POST /api/auth/reset-password  — verify OTP + set new password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body || {};
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

  const pwErr = validatePassword(newPassword);
  if (pwErr) return res.status(400).json({ error: pwErr });

  cleanExpiredOtps();
  const rows = db.prepare("SELECT * FROM otp_tokens WHERE email = ? AND purpose = 'reset' AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 5").all(email.toLowerCase().trim());
  const match = rows.find(r => bcrypt.compareSync(code, r.code_hash));
  if (!match) return res.status(400).json({ error: 'Invalid or expired code. Please request a new one.' });

  db.prepare('UPDATE otp_tokens SET used = 1 WHERE id = ?').run(match.id);

  const hash = bcrypt.hashSync(newPassword, 12);
  db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hash, email.toLowerCase().trim());

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ?').get(email.toLowerCase().trim());
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ ok: true, token, user });
});

// POST /api/auth/2fa/init  — verify password, issue OTP (2FA first step)
app.post('/api/auth/2fa/init', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password.' });

  cleanExpiredOtps();
  const code = generateOtp();
  const hash = bcrypt.hashSync(code, 8);
  db.prepare("INSERT INTO otp_tokens (email, code_hash, purpose, expires_at) VALUES (?, ?, 'login', datetime('now','+10 minutes'))").run(user.email, hash);
  console.log(`  🔐  [2FA OTP] ${user.email} → ${code}  (expires in 10 min)`);
  res.json({ ok: true, demo_code: code, message: 'OTP generated. In production this would be emailed.' });
});

// POST /api/auth/2fa/verify  — verify OTP, issue JWT
app.post('/api/auth/2fa/verify', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

  cleanExpiredOtps();
  const rows = db.prepare("SELECT * FROM otp_tokens WHERE email = ? AND purpose = 'login' AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 5").all(email.toLowerCase().trim());
  const match = rows.find(r => bcrypt.compareSync(code, r.code_hash));
  if (!match) return res.status(400).json({ error: 'Invalid or expired code.' });

  db.prepare('UPDATE otp_tokens SET used = 1 WHERE id = ?').run(match.id);

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ?').get(email.toLowerCase().trim());
  db.prepare("UPDATE users SET last_ip = ? WHERE id = ?").run(ip, user.id);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ ok: true, token, user });
});

// ─── Progress Routes ─────────────────────────────────────────

// GET /api/progress  — full dashboard data for current user
app.get('/api/progress', requireAuth, (req, res) => {
  const uid = req.user.id;

  const visits = db.prepare('SELECT page, visited_at FROM page_visits WHERE user_id = ? ORDER BY visited_at').all(uid);
  const quizzes = db.prepare('SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC LIMIT 10').all(uid);
  const games   = db.prepare('SELECT * FROM game_attempts WHERE user_id = ? ORDER BY played_at DESC LIMIT 10').all(uid);

  const bestQuiz = db.prepare('SELECT MAX(pct) as best_pct, COUNT(*) as attempts FROM quiz_attempts WHERE user_id = ?').get(uid);
  const bestGame = db.prepare('SELECT MAX(score) as best_score, COUNT(*) as attempts FROM game_attempts WHERE user_id = ?').get(uid);
  const userRow  = db.prepare('SELECT created_at FROM users WHERE id = ?').get(uid);

  res.json({
    visits,
    quizBest: bestQuiz,
    gameBest: bestGame,
    quizHistory: quizzes,
    gameHistory: games,
    created_at: userRow ? userRow.created_at : null
  });
});

// POST /api/progress/visit  — mark a page visited
app.post('/api/progress/visit', requireAuth, (req, res) => {
  const { page } = req.body || {};
  if (!page) return res.status(400).json({ error: 'page is required' });
  db.prepare('INSERT OR IGNORE INTO page_visits (user_id, page) VALUES (?, ?)').run(req.user.id, page);
  const visits = db.prepare('SELECT page FROM page_visits WHERE user_id = ?').all(req.user.id).map(r => r.page);
  res.json({ visits });
});

// POST /api/progress/quiz  — save a quiz attempt
app.post('/api/progress/quiz', requireAuth, (req, res) => {
  const { score, total, pct, passed, elapsed_sec, filter } = req.body || {};
  db.prepare('INSERT INTO quiz_attempts (user_id, score, total, pct, passed, elapsed_sec, filter) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(req.user.id, score, total, pct, passed ? 1 : 0, elapsed_sec || 0, filter || 'all');
  res.json({ ok: true });
});

// POST /api/progress/game  — save a game attempt
app.post('/api/progress/game', requireAuth, (req, res) => {
  const { score, correct, total, max_streak, rank } = req.body || {};
  db.prepare('INSERT INTO game_attempts (user_id, score, correct, total, max_streak, rank) VALUES (?, ?, ?, ?, ?, ?)')
    .run(req.user.id, score, correct, total, max_streak || 0, rank || '');
  res.json({ ok: true });
});

// ─── Video Routes ─────────────────────────────────────────────

// GET /api/videos/:moduleId  — public: get video URL for a module
app.get('/api/videos/:moduleId', (req, res) => {
  const row = db.prepare('SELECT url FROM module_videos WHERE module_id = ?').get(req.params.moduleId);
  res.json({ url: row ? row.url : '' });
});

// POST /api/admin/videos/:moduleId  — admin only: set video URL
app.post('/api/admin/videos/:moduleId', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { url } = req.body || {};
  if (url === undefined) return res.status(400).json({ error: 'url required' });
  db.prepare(`
    INSERT INTO module_videos (module_id, url, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(module_id) DO UPDATE SET url = excluded.url, updated_at = excluded.updated_at
  `).run(req.params.moduleId, url.trim());
  res.json({ ok: true });
});

// GET /api/admin/videos  — admin: get all video configs
app.get('/api/admin/videos', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = db.prepare('SELECT module_id, url, updated_at FROM module_videos ORDER BY module_id').all();
  res.json({ videos: rows });
});

// ─── Admin Route (all users summary) ─────────────────────────
app.get('/api/admin/users', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COALESCE(u.last_ip, '') as last_ip,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited,
           (SELECT MAX(pct) FROM quiz_attempts WHERE user_id = u.id) as best_quiz_pct,
           (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) as quiz_attempts,
           (SELECT MAX(score) FROM game_attempts WHERE user_id = u.id) as best_game_score
    FROM users u ORDER BY u.created_at DESC
  `).all();

  res.json({ users });
});

// GET /api/admin/stats  — aggregate stats for admin dashboard
app.get('/api/admin/stats', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const totalUsers    = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const totalVisits   = db.prepare('SELECT COUNT(*) as c FROM page_visits').get().c;
  const totalQuizzes  = db.prepare('SELECT COUNT(*) as c FROM quiz_attempts').get().c;
  const totalGames    = db.prepare('SELECT COUNT(*) as c FROM game_attempts').get().c;
  const passRate      = db.prepare('SELECT ROUND(100.0*SUM(passed)/COUNT(*)) as r FROM quiz_attempts').get().r || 0;
  const avgQuizPct    = db.prepare('SELECT ROUND(AVG(pct)) as r FROM quiz_attempts').get().r || 0;
  const avgGameScore  = db.prepare('SELECT ROUND(AVG(score)) as r FROM game_attempts').get().r || 0;

  // Page popularity
  const pageStats = db.prepare(`
    SELECT page, COUNT(*) as visits
    FROM page_visits GROUP BY page ORDER BY visits DESC
  `).all();

  // Per-page unique visitor count
  const pageUniq = db.prepare(`
    SELECT page, COUNT(DISTINCT user_id) as uniq_users
    FROM page_visits GROUP BY page ORDER BY uniq_users DESC
  `).all();

  // Recent registrations (last 10)
  const recentUsers = db.prepare(`
    SELECT id, name, email, role, created_at,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited
    FROM users u ORDER BY created_at DESC LIMIT 10
  `).all();

  // Registrations per day (last 14 days)
  const regTimeline = db.prepare(`
    SELECT DATE(created_at) as day, COUNT(*) as count
    FROM users
    WHERE created_at >= DATE('now', '-14 days')
    GROUP BY day ORDER BY day
  `).all();

  // Quiz score distribution
  const scoreBuckets = db.prepare(`
    SELECT
      SUM(CASE WHEN pct < 40 THEN 1 ELSE 0 END) as below40,
      SUM(CASE WHEN pct >= 40 AND pct < 70 THEN 1 ELSE 0 END) as p40_70,
      SUM(CASE WHEN pct >= 70 AND pct < 90 THEN 1 ELSE 0 END) as p70_90,
      SUM(CASE WHEN pct >= 90 THEN 1 ELSE 0 END) as above90
    FROM quiz_attempts
  `).get();

  res.json({
    totals: { users: totalUsers, visits: totalVisits, quizzes: totalQuizzes, games: totalGames },
    rates:  { passRate, avgQuizPct, avgGameScore },
    pageStats, pageUniq, recentUsers, regTimeline, scoreBuckets
  });
});

// POST /api/admin/promote  — promote a user to admin
app.post('/api/admin/promote', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', userId);
  res.json({ ok: true });
});

// DELETE /api/admin/users/:id  — remove a non-admin user
app.delete('/api/admin/users/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const targetId = parseInt(req.params.id, 10);
  if (!targetId || targetId === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  const target = db.prepare('SELECT role FROM users WHERE id = ?').get(targetId);
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.role === 'admin') return res.status(403).json({ error: 'Cannot delete another admin' });
  db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
  res.json({ ok: true });
});

// POST /api/admin/demote  — demote an admin back to learner
app.post('/api/admin/demote', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  if (userId === req.user.id) return res.status(400).json({ error: 'Cannot demote yourself' });
  db.prepare("UPDATE users SET role = 'learner' WHERE id = ?").run(userId);
  res.json({ ok: true });
});

// GET /api/admin/export-csv  — download all users as CSV
app.get('/api/admin/export-csv', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COALESCE(u.last_ip,'') as last_ip,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited,
           (SELECT MAX(pct) FROM quiz_attempts WHERE user_id = u.id) as best_quiz_pct,
           (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) as quiz_attempts,
           (SELECT MAX(score) FROM game_attempts WHERE user_id = u.id) as best_game_score
    FROM users u ORDER BY u.created_at DESC
  `).all();
  const header = 'id,name,email,role,created_at,last_ip,pages_visited,best_quiz_pct,quiz_attempts,best_game_score';
  const rows = users.map(u =>
    [u.id, `"${u.name.replace(/"/g,'""')}"`, `"${u.email}"`, u.role, u.created_at,
     u.last_ip, u.pages_visited, u.best_quiz_pct ?? '', u.quiz_attempts, u.best_game_score ?? ''].join(',')
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users_export.csv"');
  res.send([header, ...rows].join('\n'));
});

// POST /api/admin/seed  — make yourself admin (only works if you have no admins yet)
app.post('/api/admin/seed', requireAuth, (req, res) => {
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='admin'").get().c;
  if (adminCount > 0) return res.status(403).json({ error: 'Admins already exist' });
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', req.user.id);
  const token = require('jsonwebtoken').sign(
    { id: req.user.id, email: req.user.email, name: req.user.name, role: 'admin' },
    JWT_SECRET, { expiresIn: JWT_EXPIRY }
  );
  res.json({ ok: true, message: 'You are now admin. Please log out and log back in.', token });
});

// ─── Live Threat Intelligence (CISA KEV proxy) ────────────────
// Browser can't fetch CISA directly (CORS), so we proxy + cache server-side.
let _cisaCache = null;
let _cisaTs    = 0;

function fetchHttps(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'FinTech-Security-Training/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHttps(res.headers.location).then(resolve).catch(reject);
      }
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON parse error')); }
      });
    }).on('error', reject);
  });
}

app.get('/api/live/cisa', async (req, res) => {
  const CACHE_MS = 10 * 60 * 1000; // 10-minute cache
  if (_cisaCache && Date.now() - _cisaTs < CACHE_MS) {
    return res.json(_cisaCache);
  }
  try {
    const data = await fetchHttps(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
    );
    _cisaCache = data;
    _cisaTs    = Date.now();
    res.json(data);
  } catch (e) {
    // If live fetch fails but we have stale cache, return that
    if (_cisaCache) return res.json(_cisaCache);
    res.status(502).json({ error: 'Failed to fetch CISA data', message: e.message });
  }
});

// ─── Translation API (MyMemory, free, no key) ─────────────────
// Language code mapping from app lang to MyMemory langpair
const LANG_MAP = { zh: 'zh-CN', es: 'es', ne: 'ne-NP' };

// Helper: call MyMemory for a single text string
function myMemoryTranslate(text, targetLang) {
  return new Promise((resolve) => {
    const langpair = `en|${LANG_MAP[targetLang] || targetLang}`;
    const encoded  = encodeURIComponent(text.slice(0, 480)); // MyMemory 500 char limit
    const url = `https://api.mymemory.translated.world/get?q=${encoded}&langpair=${langpair}`;
    fetchHttps(url)
      .then(data => {
        const translated = data?.responseData?.translatedText;
        resolve((translated && translated !== text) ? translated : text);
      })
      .catch(() => resolve(text)); // fallback: return original
  });
}

// POST /api/translate  — translate an array of texts to a target language
// Body: { texts: string[], targetLang: 'zh' | 'es' | 'ne' }
// Returns: { results: string[] }
app.post('/api/translate', async (req, res) => {
  const { texts, targetLang } = req.body || {};
  if (!Array.isArray(texts) || !targetLang || targetLang === 'en') {
    return res.json({ results: texts || [] });
  }

  const results = [];
  for (const text of texts) {
    if (!text || !text.trim()) { results.push(text); continue; }
    // Check cache first
    const cacheKey = `${targetLang}:${text}`;
    const cached = db.prepare('SELECT result FROM translation_cache WHERE source = ? AND target = ?').get(text, targetLang);
    if (cached) {
      results.push(cached.result);
      continue;
    }
    // Call API
    const translated = await myMemoryTranslate(text, targetLang);
    // Store in cache
    try {
      db.prepare(`INSERT OR REPLACE INTO translation_cache (source, target, result) VALUES (?, ?, ?)`).run(text, targetLang, translated);
    } catch (_) {}
    results.push(translated);
  }

  res.json({ results });
});

// ─── Catch-all: serve React SPA index.html ────────────────
app.get('*', (req, res) => {
  // Only catch non-API paths
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🛡️  FIN7900 Training Platform`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Auth:    http://localhost:${PORT}/auth.html`);
  console.log(`  DB:      ${DB_PATH}\n`);
});
