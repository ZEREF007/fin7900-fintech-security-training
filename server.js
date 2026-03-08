/**
 * FIN7900 Training Platform — Backend Server
 * Express + MySQL (mysql2) + bcryptjs + JWT
 * Run: node server.js (then open http://localhost:3000)
 */
// Load .env file manually (no dotenv package required)
try {
  const fs = require('fs'), path0 = require('path');
  const envPath = path0.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    });
  }
} catch (_) {}

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const cors     = require('cors');
const https    = require('https');
const XLSX     = require('xlsx');
const mysql    = require('mysql2/promise');

// ─── Config ────────────────────────────────────────────
const PORT       = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fin7900-super-secret-key-change-in-prod';
const JWT_EXPIRY = '7d';
const SUPERUSER_EMAIL = 'ace0404@admin.com';
const SUPERUSER_PASSWORD = 'Qwerty1!';
const SUPERUSER_NAME = 'Ace Admin';
const DEMO_EMAIL = 'demo@guardyourdata.com';
const DEMO_PASSWORD = 'Demo1234!';

// ─── MySQL Connection Pool ──────────────────────────────────────
let pool = null;
let DB_LOAD_ERROR = null;
const LOCAL_AUTH_DIR = path.join(__dirname, 'data');
const LOCAL_AUTH_FILE = path.join(LOCAL_AUTH_DIR, 'auth-users.json');
const LOCAL_FEEDBACK_FILE = path.join(LOCAL_AUTH_DIR, 'feedback.json');

function createDbUnavailableError() {
  const err = new Error('Database unavailable');
  err.code = 'DB_UNAVAILABLE';
  return err;
}

function isDbReady() {
  return !!pool;
}

async function dbExecute(sql, params = []) {
  if (!pool) throw createDbUnavailableError();
  return pool.execute(sql, params);
}

function ensureLocalUserShape(user) {
  if (!user) return user;
  if (!Array.isArray(user.visits)) user.visits = [];
  if (!Array.isArray(user.quizHistory)) user.quizHistory = [];
  if (!Array.isArray(user.gameHistory)) user.gameHistory = [];
  if (!Array.isArray(user.moduleCompletions)) user.moduleCompletions = [];
  if (!user.created_at) user.created_at = new Date().toISOString();
  if (typeof user.last_ip !== 'string') user.last_ip = '';
  if (typeof user.email_verified !== 'number') user.email_verified = 1;
  if (!user.role) user.role = 'learner';
  return user;
}

function makeLocalUser({ id, name, email, password, role = 'learner' }) {
  return ensureLocalUserShape({
    id,
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
    email_verified: 1,
    last_ip: '',
    created_at: new Date().toISOString(),
    visits: [],
    quizHistory: [],
    gameHistory: [],
    moduleCompletions: [],
  });
}

function ensureLocalAuthStore() {
  if (!fs.existsSync(LOCAL_AUTH_DIR)) fs.mkdirSync(LOCAL_AUTH_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_AUTH_FILE)) {
    const seed = {
      nextId: 3,
      users: [
        makeLocalUser({
          id: 1,
          name: SUPERUSER_NAME,
          email: SUPERUSER_EMAIL,
          password: bcrypt.hashSync(SUPERUSER_PASSWORD, 12),
          role: 'admin',
        }),
        makeLocalUser({
          id: 2,
          name: 'Demo User',
          email: DEMO_EMAIL,
          password: bcrypt.hashSync(DEMO_PASSWORD, 12),
          role: 'learner',
        })
      ],
    };
    fs.writeFileSync(LOCAL_AUTH_FILE, JSON.stringify(seed, null, 2), 'utf8');
  }
}

function readLocalAuthStore() {
  ensureLocalAuthStore();
  try {
    const raw = fs.readFileSync(LOCAL_AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users) || typeof parsed.nextId !== 'number') {
      throw new Error('Invalid local auth store shape');
    }
    parsed.users.forEach(ensureLocalUserShape);
    return parsed;
  } catch {
    const reset = { nextId: 1, users: [] };
    fs.writeFileSync(LOCAL_AUTH_FILE, JSON.stringify(reset, null, 2), 'utf8');
    return reset;
  }
}

function writeLocalAuthStore(store) {
  ensureLocalAuthStore();
  const tmp = LOCAL_AUTH_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tmp, LOCAL_AUTH_FILE);
}

function getLocalUserByEmail(email) {
  const store = readLocalAuthStore();
  const user = ensureLocalUserShape(store.users.find(u => u.email === email.toLowerCase().trim()) || null);
  return { store, user };
}

function getLocalUserById(id) {
  const store = readLocalAuthStore();
  const user = ensureLocalUserShape(store.users.find(u => Number(u.id) === Number(id)) || null);
  return { store, user };
}

function ensureLocalBootstrapUsers() {
  const store = readLocalAuthStore();
  let changed = false;
  const now = new Date().toISOString();

  const ensureUser = ({ email, name, role, password }) => {
    const cleanEmail = email.toLowerCase().trim();
    const idx = store.users.findIndex(u => u.email === cleanEmail);
    if (idx === -1) {
      store.users.push(makeLocalUser({
        id: store.nextId++,
        name,
        email: cleanEmail,
        password: bcrypt.hashSync(password, 12),
        role,
      }));
      changed = true;
      return;
    }

    const u = ensureLocalUserShape(store.users[idx]);
    if (u.name !== name) { u.name = name; changed = true; }
    if (u.role !== role) { u.role = role; changed = true; }
    if (u.email_verified !== 1) { u.email_verified = 1; changed = true; }
    if (!u.created_at) { u.created_at = now; changed = true; }
    if (!bcrypt.compareSync(password, u.password || '')) {
      u.password = bcrypt.hashSync(password, 12);
      changed = true;
    }
  };

  ensureUser({
    email: SUPERUSER_EMAIL,
    name: SUPERUSER_NAME,
    role: 'admin',
    password: SUPERUSER_PASSWORD
  });

  ensureUser({
    email: DEMO_EMAIL,
    name: 'Demo User',
    role: 'learner',
    password: DEMO_PASSWORD
  });

  const maxId = store.users.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
  if (store.nextId <= maxId) {
    store.nextId = maxId + 1;
    changed = true;
  }

  if (changed) writeLocalAuthStore(store);
}

function toIsoNow() {
  return new Date().toISOString();
}

function buildLocalProgressPayload(user) {
  const u = ensureLocalUserShape(user);
  const visits = u.visits || [];
  const quizHistory = u.quizHistory || [];
  const gameHistory = u.gameHistory || [];
  const moduleCompletions = u.moduleCompletions || [];

  const quizScores = quizHistory.map(q => Number(q.pct) || 0);
  const gameScores = gameHistory.map(g => Number(g.score) || 0);

  return {
    visits,
    quizBest: {
      best_pct: quizScores.length ? Math.max(...quizScores) : null,
      attempts: quizHistory.length,
    },
    gameBest: {
      best_score: gameScores.length ? Math.max(...gameScores) : null,
      attempts: gameHistory.length,
    },
    quizHistory,
    gameHistory,
    moduleCompletions,
    created_at: u.created_at || null,
  };
}

function ensureLocalFeedbackStore() {
  if (!fs.existsSync(LOCAL_AUTH_DIR)) fs.mkdirSync(LOCAL_AUTH_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_FEEDBACK_FILE)) {
    fs.writeFileSync(
      LOCAL_FEEDBACK_FILE,
      JSON.stringify({ nextId: 1, feedback: [] }, null, 2),
      'utf8'
    );
  }
}

function readLocalFeedbackStore() {
  ensureLocalFeedbackStore();
  try {
    const raw = fs.readFileSync(LOCAL_FEEDBACK_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.feedback) || typeof parsed.nextId !== 'number') {
      throw new Error('Invalid local feedback store shape');
    }
    return parsed;
  } catch {
    const reset = { nextId: 1, feedback: [] };
    fs.writeFileSync(LOCAL_FEEDBACK_FILE, JSON.stringify(reset, null, 2), 'utf8');
    return reset;
  }
}

function writeLocalFeedbackStore(store) {
  ensureLocalFeedbackStore();
  const tmp = LOCAL_FEEDBACK_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tmp, LOCAL_FEEDBACK_FILE);
}

function listLocalFeedbackRows() {
  const store = readLocalFeedbackStore();
  return [...store.feedback].sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)));
}

async function initDb() {
  try {
    pool = mysql.createPool({
      host:               process.env.DB_HOST     || 'localhost',
      user:               process.env.DB_USER     || 'root',
      password:           process.env.DB_PASS     || '',
      database:           process.env.DB_NAME     || 'fin7900',
      port:               parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit:    10,
      charset:            'utf8mb4',
    });
    await dbExecute('SELECT 1'); // test connection
    console.log('  \u2705  MySQL connected to', process.env.DB_HOST || 'localhost');

    await dbExecute(`CREATE TABLE IF NOT EXISTS users (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      name           VARCHAR(255) NOT NULL,
      email          VARCHAR(255) NOT NULL UNIQUE,
      password       TEXT NOT NULL,
      role           VARCHAR(50)  NOT NULL DEFAULT 'learner',
      email_verified TINYINT(1)   NOT NULL DEFAULT 1,
      last_ip        VARCHAR(100) NOT NULL DEFAULT '',
      created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS page_visits (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT          NOT NULL,
      page       VARCHAR(255) NOT NULL,
      visited_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_page (user_id, page),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS quiz_attempts (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT         NOT NULL,
      score       INT         NOT NULL,
      total       INT         NOT NULL,
      pct         INT         NOT NULL,
      passed      TINYINT(1)  NOT NULL DEFAULT 0,
      elapsed_sec INT         NOT NULL DEFAULT 0,
      filter      VARCHAR(50) NOT NULL DEFAULT 'all',
      taken_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS game_attempts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT         NOT NULL,
      score      INT         NOT NULL,
      correct    INT         NOT NULL,
      total      INT         NOT NULL,
      max_streak INT         NOT NULL DEFAULT 0,
      rank       VARCHAR(50) NOT NULL DEFAULT '',
      played_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS module_videos (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      module_id  VARCHAR(50) NOT NULL UNIQUE,
      url        TEXT        NOT NULL,
      updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS otp_tokens (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      email      VARCHAR(255) NOT NULL,
      code_hash  TEXT         NOT NULL,
      purpose    VARCHAR(50)  NOT NULL DEFAULT 'login',
      expires_at DATETIME     NOT NULL,
      used       TINYINT(1)   NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS module_completions (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      user_id      INT         NOT NULL,
      module_id    VARCHAR(50) NOT NULL,
      mcq_score    INT,
      mcq_total    INT,
      completed_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_module (user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await dbExecute(`CREATE TABLE IF NOT EXISTS feedback (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      email        VARCHAR(255) NOT NULL,
      age_group    VARCHAR(50)  NOT NULL,
      industry     VARCHAR(100) NOT NULL,
      remarks      TEXT         NOT NULL,
      submitted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    // Safe migrations for older DBs
    try { await dbExecute("ALTER TABLE users ADD COLUMN last_ip VARCHAR(100) DEFAULT ''"); } catch (_) {}
    try { await dbExecute("ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 1"); } catch (_) {}

    // Ensure admin email is always admin
    try {
      const ADMIN_EMAIL = 'icyace007@gmail.com';
      const [rows] = await dbExecute('SELECT id, role FROM users WHERE email = ?', [ADMIN_EMAIL]);
      if (rows.length && rows[0].role !== 'admin') {
        await dbExecute("UPDATE users SET role = 'admin' WHERE email = ?", [ADMIN_EMAIL]);
        console.log(`  \u2705  Promoted ${ADMIN_EMAIL} to admin`);
      }
    } catch (e) { console.warn('  \u26a0\ufe0f  ensureAdminEmail skipped:', e.message); }

    // Ensure superuser ace0404@admin.com
    try {
      const [rows] = await dbExecute('SELECT id, role FROM users WHERE email = ?', [SUPERUSER_EMAIL]);
      const hash = bcrypt.hashSync(SUPERUSER_PASSWORD, 12);
      if (!rows.length) {
        await dbExecute(
          "INSERT IGNORE INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, 'admin', 1)",
          [SUPERUSER_NAME, SUPERUSER_EMAIL, hash]
        );
        console.log(`  \u2705  Created superuser ${SUPERUSER_EMAIL}`);
      } else {
        await dbExecute(
          "UPDATE users SET role='admin', email_verified=1, name=?, password=? WHERE email=?",
          [SUPERUSER_NAME, hash, SUPERUSER_EMAIL]
        );
        console.log(`  \u2705  Ensured superuser ${SUPERUSER_EMAIL} (admin + password synced)`);
      }
    } catch (e) { console.warn('  \u26a0\ufe0f  ensureSuperuser skipped:', e.message); }

    // Ensure demo learner
    try {
      const [rows] = await dbExecute('SELECT id FROM users WHERE email = ?', [DEMO_EMAIL]);
      if (!rows.length) {
        const hash = bcrypt.hashSync(DEMO_PASSWORD, 12);
        await dbExecute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Demo User', DEMO_EMAIL, hash, 'learner']
        );
        console.log(`  \u2705  Created demo learner ${DEMO_EMAIL}`);
      }
    } catch (e) { console.warn('  \u26a0\ufe0f  ensureDemoLearner skipped:', e.message); }

    // Seed video URLs
    try {
      const videos = [
        { module_id: 'overview', url: 'https://www.youtube.com/embed/_NDoHJsOKMY' },
        { module_id: 'module1',  url: 'https://www.youtube.com/embed/83HMr13zbhc' },
        { module_id: 'module2',  url: 'https://www.youtube.com/embed/IwDSwe7OtJg' },
        { module_id: 'module3',  url: 'https://www.youtube.com/embed/s2SfPN3atlY' },
        { module_id: 'module4',  url: 'https://www.youtube.com/embed/7g9YwY5N1KU' },
        { module_id: 'module5',  url: 'https://www.youtube.com/embed/QAWKgRVft80' },
      ];
      for (const v of videos) {
        await dbExecute(
          'INSERT INTO module_videos (module_id, url) VALUES (?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url), updated_at = NOW()',
          [v.module_id, v.url]
        );
      }
      console.log('  \u2705  Video URLs seeded (YouTube)');
    } catch (e) { console.warn('  \u26a0\ufe0f  seedVideoUrls skipped:', e.message); }

  } catch (e) {
    DB_LOAD_ERROR = e.message;
    const logPath = path.join(__dirname, 'startup-error.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] DB init failed: ${e.message}\n${e.stack}\n`);
    console.error('\u274c  DB init failed:', e.message);
    pool = null;
    ensureLocalBootstrapUsers();
  }
}

// ─── Express Setup ────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Express 4 does not auto-handle rejected promises from async handlers.
// Wrap route handlers once so thrown async errors become JSON responses.
function wrapRouteHandler(handler) {
  if (typeof handler !== 'function') return handler;
  return function wrappedHandler(req, res, next) {
    try {
      const out = handler(req, res, next);
      if (out && typeof out.then === 'function') out.catch(next);
      return out;
    } catch (err) {
      next(err);
    }
  };
}
for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
  const original = app[method].bind(app);
  app[method] = (route, ...handlers) => original(route, ...handlers.map(wrapRouteHandler));
}

app.get('/pptx/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'PPTX', filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  const ct = filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
  res.setHeader('Content-Type', ct);
  res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.sendFile(filePath);
});

// cPanel deployments can place frontend files in either:
//   1) <app>/public/*  (preferred)
//   2) <app>/*         (flat copy)
const PUBLIC_DIR_CANDIDATE = path.join(__dirname, 'public');
const PUBLIC_DIR = fs.existsSync(path.join(PUBLIC_DIR_CANDIDATE, 'index.html'))
  ? PUBLIC_DIR_CANDIDATE
  : __dirname;

app.use(express.static(PUBLIC_DIR));  // serve React build
app.use('/videos', express.static(path.join(__dirname, 'Videos')));  // serve local video files
app.use('/pptx',   express.static(path.join(__dirname, 'PPTX')));    // serve PPTX slide decks

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    storage_mode: isDbReady() ? 'mysql' : 'local-file',
    db_connected: isDbReady(),
    db_error: DB_LOAD_ERROR || null,
    server_time: new Date().toISOString(),
  });
});

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

// ─── Auth Routes ──────────────────────────────────────────────

// Password complexity checker
function validatePassword(password) {
  if (password.length < 8)          return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password))      return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password))      return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return null;
}

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });

  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ error: pwErr });

  const cleanEmail = email.toLowerCase().trim();
  const role = (cleanEmail === 'icyace007@gmail.com' || cleanEmail === SUPERUSER_EMAIL) ? 'admin' : 'learner';
  const hash = bcrypt.hashSync(password, 12);

  // Fallback path for cPanel hosts where MySQL is not configured yet.
  if (!isDbReady()) {
    const { store, user: existingUser } = getLocalUserByEmail(cleanEmail);
    if (existingUser) return res.status(409).json({ error: 'An account with this email already exists.' });

    const newUser = makeLocalUser({
      id: store.nextId++,
      name: name.trim(),
      email: cleanEmail,
      password: hash,
      role,
    });
    store.users.push(newUser);
    writeLocalAuthStore(store);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    console.log(`  \u2705  [REG][local-file] ${cleanEmail}`);
    return res.json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  }

  const [existing] = await dbExecute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
  if (existing.length) return res.status(409).json({ error: 'An account with this email already exists.' });

  const [info] = await dbExecute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name.trim(), cleanEmail, hash, role]
  );
  const code = generateOtp();
  const newUser = { id: info.insertId, name: name.trim(), email: cleanEmail, role };
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  console.log(`  \u2705  [REG][mysql] ${cleanEmail} \u2014 auto-verified, demo code: ${code}`);
  res.json({ token, user: newUser, demo_code: code });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const cleanEmail = email.toLowerCase().trim();
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  if (!isDbReady()) {
    const { store, user } = getLocalUserByEmail(cleanEmail);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    user.last_ip = ip;
    writeLocalAuthStore(store);
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  const [rows] = await dbExecute('SELECT * FROM users WHERE email = ?', [cleanEmail]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.email_verified === 0) {
    await cleanExpiredOtps();
    const code = generateOtp();
    const otpHash = bcrypt.hashSync(code, 8);
    await dbExecute(
      "INSERT INTO otp_tokens (email, code_hash, purpose, expires_at) VALUES (?, ?, 'email', DATE_ADD(NOW(), INTERVAL 30 MINUTE))",
      [user.email, otpHash]
    );
    console.log(`  \ud83d\udd11  [OTP] ${user.email} \u2192 ${code}`);
    return res.status(403).json({ error: 'Please verify your email first.', pending: true, email: user.email, demo_code: code });
  }

  await dbExecute("UPDATE users SET last_ip = ? WHERE id = ?", [ip, user.id]);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, async (req, res) => {
  if (!isDbReady()) {
    const { user } = getLocalUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      }
    });
  }
  const [rows] = await dbExecute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json({ user: rows[0] });
});

// ── OTP helpers ──────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
async function cleanExpiredOtps() {
  await dbExecute("DELETE FROM otp_tokens WHERE expires_at < NOW() OR used = 1");
}

// POST /api/auth/forgot  — request password-reset OTP
app.post('/api/auth/forgot', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  const [rows] = await dbExecute('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!rows.length) return res.json({ ok: true, demo_code: null, message: 'If this email exists, a code was sent.' });

  await cleanExpiredOtps();
  const code = generateOtp();
  const hash = bcrypt.hashSync(code, 8);
  await dbExecute(
    "INSERT INTO otp_tokens (email, code_hash, purpose, expires_at) VALUES (?, ?, 'reset', DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
    [email.toLowerCase().trim(), hash]
  );
  console.log(`  \ud83d\udd11  [RESET OTP] ${email} \u2192 ${code}  (expires in 10 min)`);
  res.json({ ok: true, demo_code: code, message: 'Demo mode: your reset code is shown below.' });
});

// POST /api/auth/reset-password  — verify OTP + set new password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body || {};
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

  const pwErr = validatePassword(newPassword);
  if (pwErr) return res.status(400).json({ error: pwErr });

  await cleanExpiredOtps();
  const [rows] = await dbExecute(
    "SELECT * FROM otp_tokens WHERE email = ? AND purpose = 'reset' AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 5",
    [email.toLowerCase().trim()]
  );
  const match = rows.find(r => bcrypt.compareSync(code, r.code_hash));
  if (!match) return res.status(400).json({ error: 'Invalid or expired code. Please request a new one.' });

  await dbExecute('UPDATE otp_tokens SET used = 1 WHERE id = ?', [match.id]);

  const hash = bcrypt.hashSync(newPassword, 12);
  await dbExecute('UPDATE users SET password = ? WHERE email = ?', [hash, email.toLowerCase().trim()]);

  const [userRows] = await dbExecute('SELECT id, name, email, role FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  const user = userRows[0];
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ ok: true, token, user });
});

// POST /api/auth/verify-email  — verify OTP code, mark email as verified, issue JWT
app.post('/api/auth/verify-email', async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

  await cleanExpiredOtps();
  const [rows] = await dbExecute(
    "SELECT * FROM otp_tokens WHERE email = ? AND purpose = 'email' AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 5",
    [email.toLowerCase().trim()]
  );
  const match = rows.find(r => bcrypt.compareSync(code, r.code_hash));
  if (!match) return res.status(400).json({ error: 'Invalid or expired code.' });

  await dbExecute('UPDATE otp_tokens SET used = 1 WHERE id = ?', [match.id]);
  await dbExecute('UPDATE users SET email_verified = 1 WHERE email = ?', [email.toLowerCase().trim()]);

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const [userRows] = await dbExecute('SELECT id, name, email, role FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  const user = userRows[0];
  await dbExecute("UPDATE users SET last_ip = ? WHERE id = ?", [ip, user.id]);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ ok: true, token, user });
});

// POST /api/auth/2fa/init  — verify password, issue OTP (2FA first step) [LEGACY — kept for resend]
app.post('/api/auth/2fa/init', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const [rows] = await dbExecute('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password.' });

  await cleanExpiredOtps();
  const code = generateOtp();
  const hash = bcrypt.hashSync(code, 8);
  await dbExecute(
    "INSERT INTO otp_tokens (email, code_hash, purpose, expires_at) VALUES (?, ?, 'login', DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
    [user.email, hash]
  );
  console.log(`  \ud83d\udd10  [2FA OTP] ${user.email} \u2192 ${code}  (expires in 10 min)`);
  res.json({ ok: true, demo_code: code, message: 'OTP generated. In production this would be emailed.' });
});

// POST /api/auth/2fa/verify  — verify OTP, issue JWT
app.post('/api/auth/2fa/verify', async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

  await cleanExpiredOtps();
  const [rows] = await dbExecute(
    "SELECT * FROM otp_tokens WHERE email = ? AND purpose = 'login' AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 5",
    [email.toLowerCase().trim()]
  );
  const match = rows.find(r => bcrypt.compareSync(code, r.code_hash));
  if (!match) return res.status(400).json({ error: 'Invalid or expired code.' });

  await dbExecute('UPDATE otp_tokens SET used = 1 WHERE id = ?', [match.id]);

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const [userRows] = await dbExecute('SELECT id, name, email, role FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  const user = userRows[0];
  await dbExecute("UPDATE users SET last_ip = ? WHERE id = ?", [ip, user.id]);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ ok: true, token, user });
});

// ─── Progress Routes ───────────────────────────────────────────

// GET /api/progress  — full dashboard data for current user
app.get('/api/progress', requireAuth, async (req, res) => {
  const uid = req.user.id;

  if (!isDbReady()) {
    const { user } = getLocalUserById(uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(buildLocalProgressPayload(user));
  }

  const [visits]      = await dbExecute('SELECT page, visited_at FROM page_visits WHERE user_id = ? ORDER BY visited_at', [uid]);
  const [quizzes]     = await dbExecute('SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC LIMIT 10', [uid]);
  const [games]       = await dbExecute('SELECT * FROM game_attempts WHERE user_id = ? ORDER BY played_at DESC LIMIT 10', [uid]);
  const [completions] = await dbExecute('SELECT module_id, mcq_score, mcq_total, completed_at FROM module_completions WHERE user_id = ?', [uid]);

  const [[bestQuiz]]  = await dbExecute('SELECT MAX(pct) as best_pct, COUNT(*) as attempts FROM quiz_attempts WHERE user_id = ?', [uid]);
  const [[bestGame]]  = await dbExecute('SELECT MAX(score) as best_score, COUNT(*) as attempts FROM game_attempts WHERE user_id = ?', [uid]);
  const [[userRow]]   = await dbExecute('SELECT created_at FROM users WHERE id = ?', [uid]);

  res.json({
    visits,
    quizBest: bestQuiz,
    gameBest: bestGame,
    quizHistory: quizzes,
    gameHistory: games,
    moduleCompletions: completions,
    created_at: userRow ? userRow.created_at : null
  });
});

// POST /api/progress/visit  — mark a page visited
app.post('/api/progress/visit', requireAuth, async (req, res) => {
  const { page } = req.body || {};
  if (!page) return res.status(400).json({ error: 'page is required' });

  if (!isDbReady()) {
    const { store, user } = getLocalUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const now = toIsoNow();
    const existing = user.visits.find(v => v.page === page);
    if (existing) existing.visited_at = now;
    else user.visits.push({ page, visited_at: now });
    writeLocalAuthStore(store);
    return res.json({ visits: user.visits.map(v => v.page) });
  }

  await dbExecute('INSERT IGNORE INTO page_visits (user_id, page) VALUES (?, ?)', [req.user.id, page]);
  const [rows] = await dbExecute('SELECT page FROM page_visits WHERE user_id = ?', [req.user.id]);
  res.json({ visits: rows.map(r => r.page) });
});

// POST /api/progress/quiz  — save a quiz attempt
app.post('/api/progress/quiz', requireAuth, async (req, res) => {
  const { score, total, pct, passed, elapsed_sec, filter } = req.body || {};

  if (!isDbReady()) {
    const { store, user } = getLocalUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.quizHistory.push({
      score: Number(score) || 0,
      total: Number(total) || 0,
      pct: Number(pct) || 0,
      passed: passed ? 1 : 0,
      elapsed_sec: Number(elapsed_sec) || 0,
      filter: filter || 'all',
      taken_at: toIsoNow(),
    });
    writeLocalAuthStore(store);
    return res.json({ ok: true });
  }

  await dbExecute(
    'INSERT INTO quiz_attempts (user_id, score, total, pct, passed, elapsed_sec, filter) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, score, total, pct, passed ? 1 : 0, elapsed_sec || 0, filter || 'all']
  );
  res.json({ ok: true });
});

// POST /api/progress/game  — save a game attempt
app.post('/api/progress/game', requireAuth, async (req, res) => {
  const { score, correct, total, max_streak, rank } = req.body || {};

  if (!isDbReady()) {
    const { store, user } = getLocalUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.gameHistory.push({
      score: Number(score) || 0,
      correct: Number(correct) || 0,
      total: Number(total) || 0,
      max_streak: Number(max_streak) || 0,
      rank: rank || '',
      played_at: toIsoNow(),
    });
    writeLocalAuthStore(store);
    return res.json({ ok: true });
  }

  await dbExecute(
    'INSERT INTO game_attempts (user_id, score, correct, total, max_streak, rank) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, score, correct, total, max_streak || 0, rank || '']
  );
  res.json({ ok: true });
});

// POST /api/progress/module-complete  — mark a module fully completed
app.post('/api/progress/module-complete', requireAuth, async (req, res) => {
  const { module_id, mcq_score, mcq_total } = req.body || {};
  if (!module_id) return res.status(400).json({ error: 'module_id required' });

  if (!isDbReady()) {
    const { store, user } = getLocalUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const existing = user.moduleCompletions.find(m => m.module_id === module_id);
    if (existing) {
      existing.mcq_score = mcq_score ?? null;
      existing.mcq_total = mcq_total ?? null;
      existing.completed_at = toIsoNow();
    } else {
      user.moduleCompletions.push({
        module_id,
        mcq_score: mcq_score ?? null,
        mcq_total: mcq_total ?? null,
        completed_at: toIsoNow(),
      });
    }
    writeLocalAuthStore(store);
    return res.json({ ok: true });
  }

  await dbExecute(
    `INSERT INTO module_completions (user_id, module_id, mcq_score, mcq_total)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       mcq_score    = VALUES(mcq_score),
       mcq_total    = VALUES(mcq_total),
       completed_at = NOW()`,
    [req.user.id, module_id, mcq_score ?? null, mcq_total ?? null]
  );
  res.json({ ok: true });
});

// ─── Video Routes ───────────────────────────────────────────────

// GET /api/videos/:moduleId  — public: get video URL for a module
app.get('/api/videos/:moduleId', async (req, res) => {
  const [rows] = await dbExecute('SELECT url FROM module_videos WHERE module_id = ?', [req.params.moduleId]);
  res.json({ url: rows.length ? rows[0].url : '' });
});

// POST /api/admin/videos/:moduleId  — admin only: set video URL
app.post('/api/admin/videos/:moduleId', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { url } = req.body || {};
  if (url === undefined) return res.status(400).json({ error: 'url required' });
  await dbExecute(
    'INSERT INTO module_videos (module_id, url) VALUES (?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url), updated_at = NOW()',
    [req.params.moduleId, url.trim()]
  );
  res.json({ ok: true });
});

// GET /api/admin/videos  — admin: get all video configs
app.get('/api/admin/videos', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const [rows] = await dbExecute('SELECT module_id, url, updated_at FROM module_videos ORDER BY module_id');
  res.json({ videos: rows });
});

// ─── Admin Route (all users summary) ───────────────────────
app.get('/api/admin/users', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const [users] = await dbExecute(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COALESCE(u.last_ip, '') as last_ip,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited,
           (SELECT MAX(pct) FROM quiz_attempts WHERE user_id = u.id) as best_quiz_pct,
           (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) as quiz_attempts,
           (SELECT MAX(score) FROM game_attempts WHERE user_id = u.id) as best_game_score
    FROM users u ORDER BY u.created_at DESC
  `);

  res.json({ users });
});

// GET /api/admin/stats  — aggregate stats for admin dashboard
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const [[totU]]  = await dbExecute('SELECT COUNT(*) as c FROM users');
  const [[totV]]  = await dbExecute('SELECT COUNT(*) as c FROM page_visits');
  const [[totQ]]  = await dbExecute('SELECT COUNT(*) as c FROM quiz_attempts');
  const [[totG]]  = await dbExecute('SELECT COUNT(*) as c FROM game_attempts');
  const [[pass]]  = await dbExecute('SELECT ROUND(100*SUM(passed)/COUNT(*)) as r FROM quiz_attempts');
  const [[avgQ]]  = await dbExecute('SELECT ROUND(AVG(pct)) as r FROM quiz_attempts');
  const [[avgG]]  = await dbExecute('SELECT ROUND(AVG(score)) as r FROM game_attempts');

  const [pageStats] = await dbExecute('SELECT page, COUNT(*) as visits FROM page_visits GROUP BY page ORDER BY visits DESC');
  const [pageUniq]  = await dbExecute('SELECT page, COUNT(DISTINCT user_id) as uniq_users FROM page_visits GROUP BY page ORDER BY uniq_users DESC');
  const [recentUsers] = await dbExecute(`
    SELECT id, name, email, role, created_at,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited
    FROM users u ORDER BY created_at DESC LIMIT 10
  `);
  const [regTimeline] = await dbExecute(`
    SELECT DATE(created_at) as day, COUNT(*) as count
    FROM users
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
    GROUP BY day ORDER BY day
  `);
  const [[scoreBuckets]] = await dbExecute(`
    SELECT
      SUM(CASE WHEN pct < 40 THEN 1 ELSE 0 END) as below40,
      SUM(CASE WHEN pct >= 40 AND pct < 70 THEN 1 ELSE 0 END) as p40_70,
      SUM(CASE WHEN pct >= 70 AND pct < 90 THEN 1 ELSE 0 END) as p70_90,
      SUM(CASE WHEN pct >= 90 THEN 1 ELSE 0 END) as above90
    FROM quiz_attempts
  `);
  const [moduleSummary] = await dbExecute('SELECT module_id, COUNT(DISTINCT user_id) as users_completed FROM module_completions GROUP BY module_id ORDER BY module_id');
  const [[totF]] = await dbExecute('SELECT COUNT(*) as c FROM feedback');

  res.json({
    totals: { users: totU.c, visits: totV.c, quizzes: totQ.c, games: totG.c },
    rates:  { passRate: pass.r || 0, avgQuizPct: avgQ.r || 0, avgGameScore: avgG.r || 0 },
    pageStats, pageUniq, recentUsers, regTimeline, scoreBuckets, moduleSummary,
    totalFeedback: totF.c
  });
});

// POST /api/admin/promote  — promote a user to admin
app.post('/api/admin/promote', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  await dbExecute('UPDATE users SET role = ? WHERE id = ?', ['admin', userId]);
  res.json({ ok: true });
});

// DELETE /api/admin/users/:id  — remove a non-admin user
app.delete('/api/admin/users/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const targetId = parseInt(req.params.id, 10);
  if (!targetId || targetId === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  const [rows] = await dbExecute('SELECT role FROM users WHERE id = ?', [targetId]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  if (rows[0].role === 'admin') return res.status(403).json({ error: 'Cannot delete another admin' });
  await dbExecute('DELETE FROM users WHERE id = ?', [targetId]);
  res.json({ ok: true });
});

// POST /api/admin/demote  — demote an admin back to learner
app.post('/api/admin/demote', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  if (userId === req.user.id) return res.status(400).json({ error: 'Cannot demote yourself' });
  await dbExecute("UPDATE users SET role = 'learner' WHERE id = ?", [userId]);
  res.json({ ok: true });
});

// GET /api/admin/export-csv  — download all users as CSV
app.get('/api/admin/export-csv', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const [users] = await dbExecute(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COALESCE(u.last_ip,'') as last_ip,
           (SELECT COUNT(*) FROM page_visits WHERE user_id = u.id) as pages_visited,
           (SELECT MAX(pct) FROM quiz_attempts WHERE user_id = u.id) as best_quiz_pct,
           (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) as quiz_attempts,
           (SELECT MAX(score) FROM game_attempts WHERE user_id = u.id) as best_game_score
    FROM users u ORDER BY u.created_at DESC
  `);
  const header = 'id,name,email,role,created_at,last_ip,pages_visited,best_quiz_pct,quiz_attempts,best_game_score';
  const rows = users.map(u =>
    [u.id, `"${u.name.replace(/"/g,'""')}"`, `"${u.email}"`, u.role, u.created_at,
     u.last_ip, u.pages_visited, u.best_quiz_pct ?? '', u.quiz_attempts, u.best_game_score ?? ''].join(',')
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users_export.csv"');
  res.send([header, ...rows].join('\n'));
});

// POST /api/feedback  — public: submit a feedback entry
app.post('/api/feedback', async (req, res) => {
  const { name, email, age_group, industry, remarks } = req.body || {};
  if (!name || !email || !age_group || !industry)
    return res.status(400).json({ error: 'Name, email, age group and industry are required.' });

  if (!isDbReady()) {
    const store = readLocalFeedbackStore();
    store.feedback.push({
      id: store.nextId++,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age_group,
      industry,
      remarks: (remarks || '').trim(),
      submitted_at: toIsoNow(),
    });
    writeLocalFeedbackStore(store);
    return res.json({ ok: true });
  }

  await dbExecute(
    'INSERT INTO feedback (name, email, age_group, industry, remarks) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), email.toLowerCase().trim(), age_group, industry, (remarks || '').trim()]
  );
  res.json({ ok: true });
});

// GET /api/admin/feedback  — admin: list all feedback
app.get('/api/admin/feedback', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  if (!isDbReady()) {
    return res.json({ feedback: listLocalFeedbackRows() });
  }

  const [rows] = await dbExecute(
    'SELECT id, name, email, age_group, industry, remarks, submitted_at FROM feedback ORDER BY submitted_at DESC'
  );
  res.json({ feedback: rows });
});

// GET /api/admin/export-feedback  — admin: CSV download
app.get('/api/admin/export-feedback', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = isDbReady()
    ? (await dbExecute('SELECT id, name, email, age_group, industry, remarks, submitted_at FROM feedback ORDER BY submitted_at DESC'))[0]
    : listLocalFeedbackRows();
  const header = 'id,name,email,age_group,industry,remarks,submitted_at';
  const lines = rows.map(r =>
    [r.id, `"${r.name.replace(/"/g,'""')}"`, `"${r.email}"`, `"${r.age_group}"`,
     `"${r.industry}"`, `"${(r.remarks||'').replace(/"/g,'""')}"`, r.submitted_at].join(',')
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="feedback_export.csv"');
  res.send([header, ...lines].join('\n'));
});

// GET /api/admin/export-feedback-excel  — admin: Excel .xlsx download
app.get('/api/admin/export-feedback-excel', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = isDbReady()
    ? (await dbExecute('SELECT id, name, email, age_group, industry, remarks, submitted_at FROM feedback ORDER BY submitted_at DESC'))[0]
    : listLocalFeedbackRows();
  const ws = XLSX.utils.json_to_sheet(rows.map(r => ({
    'ID':           r.id,
    'Name':         r.name,
    'Email':        r.email,
    'Age Group':    r.age_group,
    'Industry':     r.industry,
    'Remarks':      r.remarks || '',
    'Submitted At': r.submitted_at
  })));
  ws['!cols'] = [{wch:5},{wch:25},{wch:35},{wch:15},{wch:25},{wch:65},{wch:22}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Feedback');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="feedback_export.xlsx"');
  res.send(buf);
});

// POST /api/admin/seed  — make yourself admin (only works if you have no admins yet)
app.post('/api/admin/seed', requireAuth, async (req, res) => {
  const [[{ c }]] = await dbExecute("SELECT COUNT(*) as c FROM users WHERE role='admin'");
  if (c > 0) return res.status(403).json({ error: 'Admins already exist' });
  await dbExecute('UPDATE users SET role = ? WHERE id = ?', ['admin', req.user.id]);
  const token = jwt.sign(
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

// ─── Catch-all: serve React SPA index.html ────────────────
app.get('*', (req, res) => {
  // Only catch non-API paths
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.use((err, req, res, _next) => {
  const looksLikeDbIssue =
    err?.code === 'DB_UNAVAILABLE' ||
    /Cannot read properties of null \(reading 'execute'\)/.test(err?.message || '');

  if (looksLikeDbIssue) {
    return res.status(503).json({
      error: 'Database is not configured yet on the server.',
      storage_mode: isDbReady() ? 'mysql' : 'local-file',
    });
  }

  console.error('❌ API error:', err?.stack || err?.message || err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────
initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  \ud83d\udee1\ufe0f  FIN7900 Training Platform`);
    console.log(`  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  DB:      ${isDbReady() ? `MySQL @ ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'fin7900'}` : `fallback local file (${LOCAL_AUTH_FILE})`}`);
    console.log(`  Mode:    \ud83c\udfaf  Demo \u2014 OTP codes shown on screen\n`);
  });
}).catch(err => {
  console.error('\u274c  Failed to start:', err.message);
  process.exit(1);
});
