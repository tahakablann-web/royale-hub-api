// Royale HUB v8.0 - Resmi Clash Royale Veri Sunucusu & Topluluk API
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const DATA_DIR = process.env.DATA_DIR || __dirname;
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const PREFS_FILE = path.join(DATA_DIR, 'user-prefs.json');
const SUPPORT_FILE = path.join(DATA_DIR, 'support-messages.json');
const PRIVACY_FILE = path.join(__dirname, 'privacy-policy.html');
const USERS_FILE = path.join(DATA_DIR, 'auth-users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'auth-sessions.json');
const GLOBAL_CHAT_FILE = path.join(DATA_DIR, 'global-chat.json');
const DECK_SHARES_FILE = path.join(DATA_DIR, 'deck-shares.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const ADMIN_REPORTS_FILE = path.join(DATA_DIR, 'admin-reports.json');
const DECK_RATINGS_FILE = path.join(DATA_DIR, 'deck-ratings.json');

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'tahakablann@gmail.com')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_TAGS = (process.env.ADMIN_TAGS || '#2P29Q0UU2')
  .split(',')
  .map((s) => s.trim().toUpperCase())
  .filter(Boolean);

const DEFAULT_NEWS_ITEMS = [
  {
    id: 'news-1',
    tag: '🚀 GELECEK GÜNCELLEME',
    tagEn: '🚀 UPCOMING UPDATE',
    tagColor: '#FFB800',
    publishedAt: '2026-11-22T14:30:00+03:00',
    date: '22 Kasım 2026, Pazar • 14:30',
    dateEn: 'Nov 22, 2026, Sunday • 14:30',
    title: 'Yeni Evrimler ve Kule Birliği Dengelemesi Geliyor!',
    titleEn: 'New Card Evolutions & Tower Troop Balances Incoming!',
    summary:
      'Önümüzdeki sezon güncellemesiyle birlikte 2 yeni Kart Evrimi (Evolution) ve Efsaneler Yolu kupa sıfırlaması aktif olacak. Evrim parçalarınızı (Wild Shards) yeni sezon öncesi biriktirmeniz önerilir.',
    summaryEn:
      'The upcoming seasonal update introduces 2 new Card Evolutions and a Path of Legends reset. Saving your Evolution Wild Shards before the new season drops is strongly recommended.',
    highlights: [
      '⚡ Yeni Evrim Slotları ve Şampiyon dengelemeleri test ediliyor.',
      '🎁 Kraliyet Turnuvası 10+ galibiyet bonus ödüllerinde Efsanevi Kral Sandığı fırsatı.',
      '🛡️ Düşük kullanılan bina kartlarına +%6 Can (HP) güçlendirmesi (Buff) bekleniyor.',
    ],
    highlightsEn: [
      '⚡ New Evolution slots and Champion balance tweaks are currently in testing.',
      '🎁 Global Tournament 10+ win bonus rewards feature Legendary King’s Chests.',
      '🛡️ Underused defensive buildings are expected to receive a +6% HP buff.',
    ],
  },
  {
    id: 'news-2',
    tag: '⚖️ DENGELEME (BUFF / NERF)',
    tagEn: '⚖️ BALANCE CHANGES',
    tagColor: '#38BDF8',
    publishedAt: '2026-11-20T18:15:00+03:00',
    date: '20 Kasım 2026, Cuma • 18:15',
    dateEn: 'Nov 20, 2026, Friday • 18:15',
    title: 'Meta Değişiyor: Güçlenen (Buff) ve Zayıflayan (Nerf) Kartlar',
    titleEn: 'Meta Shift: Top Buffed & Nerfed Cards Right Now',
    summary:
      'Son dengeleme paketi sonrasında Köprü Spam ve Evrimli P.E.K.K.A destelerinin kazanma oranı %61 üzerine çıkarken, ağır iksirli destelerde Yıldırım büyüsü öne geçti.',
    summaryEn:
      'Following recent balance adjustments, Bridge Spam and Evo P.E.K.K.A decks surged past a 61% win rate while Lightning dominates heavy Beatdown matchups.',
    highlights: [
      '📈 GÜÇLENENLER (BUFF): P.E.K.K.A Evrimi, Koçbaşı, Balıkçı, Bombacı Evrimi.',
      '📉 ZAYIFLAYANLAR (NERF): Aşırı savunma binaları ve üçlü küçük büyü döngüleri.',
      '💡 Tavsiye: 20. Arena ve üzerindeyseniz destenizde mutlaka 1 sıfırlama kartı (Çarpma / Elektro Büyücü) bulundurun.',
    ],
    highlightsEn: [
      '📈 WINNERS (BUFFED): Evo P.E.K.K.A, Battle Ram, Fisherman, Evo Bomber.',
      '📉 LOSERS (NERFED): Passive defensive buildings and triple small-spell cycles.',
      '💡 Pro Tip: At Arena 20+, always include at least one reset card (Zap / Electro Wizard) in your deck.',
    ],
  },
  {
    id: 'news-3',
    tag: '🏆 ETKİNLİK & TURNUVA',
    tagEn: '🏆 EVENTS & TOURNAMENTS',
    tagColor: '#D946EF',
    publishedAt: '2026-11-18T11:00:00+03:00',
    date: '18 Kasım 2026, Çarşamba • 11:00',
    dateEn: 'Nov 18, 2026, Wednesday • 11:00',
    title: 'Küresel Turnuva & İkili İksir Mücadelesi Başlıyor',
    titleEn: 'Global Tournament & Double Elixir Challenge Live',
    summary:
      'Supercell resmi turnuva takvimine göre bu hafta sonu Küresel Turnuva (Global Tournament) ve Özel Evrim Mücadelesi etkinlik sekmesinde açılıyor.',
    summaryEn:
      'According to the official tournament schedule, the Global Tournament and Special Evolution Challenge open this weekend in the Events tab.',
    highlights: [
      '👑 Küresel Turnuva hedefi: En az 10 galibiyet alarak 500 Taş değerindeki Bonus Ödül Kasasını açmak.',
      '🔥 Ücretsiz Etkinlik Mağazası (Season Shop) üzerinden 1 adet Evrim Parçası ve 3 adet Kart Kitabı almayı unutmayın!',
    ],
    highlightsEn: [
      '👑 Global Tournament goal: Hit 10+ wins to unlock maximum value on the 500-Gem Bonus Rewards.',
      '🔥 Remember to claim your monthly Wild Evolution Shard and Magic Books from the Season Shop!',
    ],
  },
];

function isUserAdmin(userObj) {
  if (!userObj) return false;
  const email = String(userObj.email || '').trim().toLowerCase();
  const tag = String(userObj.tag || '').trim().toUpperCase();
  return Boolean(
    userObj.isAdmin ||
      (email && ADMIN_EMAILS.includes(email)) ||
      (tag && ADMIN_TAGS.includes(tag))
  );
}

let sqliteDb = null;
try {
  const { DatabaseSync } = require('node:sqlite');
  sqliteDb = new DatabaseSync(path.join(DATA_DIR, 'royale-hub.db'));
  sqliteDb.exec(
    'CREATE TABLE IF NOT EXISTS kv_store (store_key TEXT PRIMARY KEY, payload TEXT NOT NULL)'
  );
} catch (e) {
  sqliteDb = null;
}

// Bulut Kalıcı Depo Desteği (Opsiyonel Upstash REST API -> Sunucu uyuyup kalksa da veriler sıfırlanmaz)
const UPSTASH_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const CLOUD_STORE_ENABLED = Boolean(UPSTASH_URL && UPSTASH_TOKEN);
const memoryStoreCache = {};

function upstashCommand(cmdArgs) {
  return new Promise((resolve) => {
    if (!CLOUD_STORE_ENABLED) return resolve(null);
    try {
      const target = new URL(UPSTASH_URL);
      const postData = JSON.stringify(cmdArgs);
      const opts = {
        hostname: target.hostname,
        path: target.pathname === '/' ? '' : target.pathname,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };
      const req = https.request(opts, (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.write(postData);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

// Bulutta (Render/Railway) sabit IP engeline takılmamak için CR_USE_PROXY=true olduğunda proxy.royaleapi.dev kullanılır
const USE_PROXY =
  process.env.CR_USE_PROXY === 'true' ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.RAILWAY_ENVIRONMENT);
const CR_API_HOST =
  process.env.CR_API_HOST ||
  (USE_PROXY ? 'proxy.royaleapi.dev' : 'api.clashroyale.com');

const SUPERCELL_API_KEY =
  process.env.CR_API_KEY ||
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjVhMGM3MTRhLTdmZmUtNDhjYy1iODcxLTMwMWZiNjdmZjU0OSIsImlhdCI6MTc5NDk0MzI2Mywic3ViIjoiZGV2ZWxvcGVyLzdhZTkxODk5LWM3NDItNDRmOC04YWU4LTQ1NTdlMTM3ZjYxZSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3OC4xNzIuMjUxLjE0NCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.p0GazxPRKbMADYeP13g91ejfklQUBkPaDCW371cHM5g36t_oX4wRmQepdPRRnuVdLp4eCFPKXs9GdpC5WJdeFw';

let cachedCards = null;
let cachedLeaderboardGlobal = null;
let cachedLeaderboardTR = null;
let cachedClanLeaderboardGlobal = null;
let cachedClanLeaderboardTR = null;
let cachedEvents = null;
let turkeyLocationId = null;
const arenaDecksCache = new Map();

const LOCAL_CARD_BY_SLUG = new Map();
try {
  const catRaw = fs.readFileSync(
    path.join(__dirname, 'src', 'data', 'cardCatalog.js'),
    'utf8'
  );
  const arr = JSON.parse(catRaw.slice(catRaw.indexOf('['), catRaw.lastIndexOf(']') + 1));
  arr.forEach((c) => {
    const slug = String(c.key || '').replace(/-/g, '_').toLowerCase();
    LOCAL_CARD_BY_SLUG.set(slug, c);
    LOCAL_CARD_BY_SLUG.set(slug.replace(/_/g, ''), c);
  });
} catch (e) {}

async function fetchHttpsText(targetUrl) {
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    const html = await res.text();
    return { status: res.status, html };
  } catch (e) {
    return { status: 0, html: '' };
  }
}

// Uygulamadaki Gerçek Canlı Aktif Kullanıcılar (Son 90 sn içinde heartbeat atanlar)
const ONLINE_WINDOW_MS = 90 * 1000;
const activePresenceMap = new Map();

function touchPresence(user) {
  if (!user || !user.userId) return;
  activePresenceMap.set(user.userId, {
    userId: user.userId,
    displayName: user.displayName,
    authType: user.authType,
    tag: user.tag || null,
    trophies: typeof user.trophies === 'number' ? user.trophies : null,
    clanName: user.clanName || null,
    isAdmin: Boolean(user.isAdmin || isUserAdmin(user)),
    lastSeenMs: Date.now(),
  });
}

function getOnlineUsers() {
  const now = Date.now();
  const list = [];
  for (const [uid, entry] of activePresenceMap.entries()) {
    if (now - entry.lastSeenMs <= ONLINE_WINDOW_MS) {
      list.push({
        userId: entry.userId,
        displayName: entry.displayName,
        authType: entry.authType,
        tag: entry.tag,
        trophies: entry.trophies,
        clanName: entry.clanName,
      });
    } else {
      activePresenceMap.delete(uid);
    }
  }
  return list.sort((a, b) => (b.trophies || 0) - (a.trophies || 0));
}

// Google Play UGC Politikası için Küfür / Spam / Link Filtresi
const BLOCKED_WORDS = [
  'amk', 'aq', 'orospu', 'piç', 'pic', 'siktir', 'yarrak', 'göt', 'fuck', 'shit', 'bitch', 'asshole',
];

function sanitizeChatText(text, maxLen = 240) {
  let clean = String(text || '').trim().slice(0, maxLen);
  clean = clean.replace(/(https?:\/\/\S+|www\.\S+|discord\.gg\/\S+)/gi, '[link]');
  BLOCKED_WORDS.forEach((w) => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi');
    clean = clean.replace(regex, '***');
  });
  return clean;
}

function readJsonFile(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {}
  return fallback;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
}

function readStore(storeKey, filePath, fallback) {
  if (memoryStoreCache[storeKey] !== undefined) {
    return memoryStoreCache[storeKey];
  }
  if (sqliteDb) {
    try {
      const row = sqliteDb
        .prepare('SELECT payload FROM kv_store WHERE store_key = ?')
        .get(storeKey);
      if (row && row.payload) {
        const parsed = JSON.parse(row.payload);
        memoryStoreCache[storeKey] = parsed;
        return parsed;
      }
    } catch (e) {}
  }
  const localData = readJsonFile(filePath, fallback);
  memoryStoreCache[storeKey] = localData;
  return localData;
}

function writeStore(storeKey, filePath, data) {
  memoryStoreCache[storeKey] = data;
  writeJsonFile(filePath, data);
  if (sqliteDb) {
    try {
      sqliteDb
        .prepare(
          'INSERT INTO kv_store (store_key, payload) VALUES (?, ?) ON CONFLICT(store_key) DO UPDATE SET payload = excluded.payload'
        )
        .run(storeKey, JSON.stringify(data));
    } catch (e) {}
  }
  if (CLOUD_STORE_ENABLED) {
    upstashCommand(['SET', `rh_${storeKey}`, JSON.stringify(data)]);
  }
}

async function initCloudStore() {
  if (!CLOUD_STORE_ENABLED) return;
  const entries = [
    ['auth_users', USERS_FILE, []],
    ['auth_sessions', SESSIONS_FILE, {}],
    ['global_chat', GLOBAL_CHAT_FILE, []],
    ['deck_shares', DECK_SHARES_FILE, getDefaultDeckShares()],
    ['support_tickets', SUPPORT_FILE, []],
    ['user_prefs', PREFS_FILE, { lastTag: '#G9YV9GR8R', savedAccounts: [], savedDecks: [] }],
  ];
  for (const [key, filePath, fallback] of entries) {
    const res = await upstashCommand(['GET', `rh_${key}`]);
    if (res && typeof res.result === 'string') {
      try {
        const parsed = JSON.parse(res.result);
        memoryStoreCache[key] = parsed;
        writeJsonFile(filePath, parsed);
        continue;
      } catch (e) {}
    }
    memoryStoreCache[key] = readJsonFile(filePath, fallback);
  }
}

function hashPin(pin, salt) {
  return crypto.scryptSync(String(pin), String(salt), 64).toString('hex');
}

function verifyPin(pin, salt, storedHash) {
  try {
    const computed = Buffer.from(hashPin(pin, salt), 'hex');
    const saved = Buffer.from(String(storedHash || ''), 'hex');
    if (computed.length !== saved.length) return false;
    return crypto.timingSafeEqual(computed, saved);
  } catch (e) {
    return false;
  }
}

function createSession(user) {
  const token = crypto.randomBytes(24).toString('hex');
  const sessions = { ...readStore('auth_sessions', SESSIONS_FILE, {}) };
  sessions[token] = { ...user, issuedAt: new Date().toISOString() };
  const keys = Object.keys(sessions);
  if (keys.length > 300) {
    keys.slice(0, keys.length - 300).forEach((k) => delete sessions[k]);
  }
  writeStore('auth_sessions', SESSIONS_FILE, sessions);
  touchPresence(user);
  return token;
}

function getBearerToken(req) {
  const authHeader = String(req.headers.authorization || '');
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return '';
}

function getAuthUserFromRequest(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  const sessions = readStore('auth_sessions', SESSIONS_FILE, {});
  const user = sessions[token];
  if (!user || !user.userId) return null;
  const users = readStore('auth_users', USERS_FILE, []);
  const record = users.find((u) => u.userId === user.userId);
  if (record?.banned) return null;
  const hydrated = {
    ...user,
    isAdmin: isUserAdmin(record || user),
  };
  touchPresence(hydrated);
  return hydrated;
}

function getDefaultDeckShares() {
  return [
    {
      id: 'ds-welcome-pekka',
      userId: 'cr:#2Y8L9Q',
      author: 'KralOyuncu TR',
      authorTag: '#2Y8L9Q',
      trophies: 9000,
      title: 'Evrimli P.E.K.K.A Köprü Spam',
      description:
        '23. Arenada beni 9000 kupaya çıkaran P.E.K.K.A destesi! Savunmada P.E.K.K.A + Elektro Büyücü ile durdurup Koçbaşı & Haydut ile karşı baskı kurabilirsiniz.',
      avgElixir: '3.9',
      deckIds: [26000004, 26000036, 26000046, 26000050, 26000042, 26000062, 28000008, 28000009],
      likes: 18,
      createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      reports: 0,
    },
  ];
}

function generateFallbackLeaderboard(region) {
  const trNames = [
    'FurkanArabacı', 'KralOyuncu TR', 'AnadoluAslanı', 'Bozkurt_34', 'EfsaneTürk',
    'YavuzSultan', 'Göktürk_1923', 'Efe_CR', 'KaradenizFırtına', 'AtillaHan',
  ];
  const globalNames = [
    'Mohamed Light', 'Mugi', 'LucasXGamer', 'Morten', 'Surgical Goblin',
    'Ian77', 'Ryley', 'Eragon', 'Viiper', 'PedroTM',
  ];
  const baseNames = region === 'TR' ? trNames : globalNames;
  const items = [];
  for (let i = 1; i <= 100; i++) {
    const base = baseNames[(i - 1) % baseNames.length];
    items.push({
      rank: i,
      name: i <= 10 ? base : `${base} #${i}`,
      tag: `#G9YV9G${100 + i}`,
      eloRating: 3850 - i * 8,
      trophies: 9000,
      clan: {
        name: region === 'TR' ? 'Anadolu Efsaneleri' : 'Tribe Gaming',
        tag: '#2Y8L9Q',
      },
    });
  }
  return { items };
}

function generateFallbackClanLeaderboard(region) {
  const trClans = [
    'Anadolu Efsaneleri', 'Türk Yıldızları', 'Bozkurtlar TR', 'Osmanlı Torunları', 'Ay Yıldız Espor',
    'İstanbul Royals', 'Kızıl Elma TR', 'Ankara Gücü CR', 'İzmir Fırtınası', 'Göktürk Birliği',
  ];
  const globalClans = [
    'Tribe Gaming', 'SK Gaming', 'Team Liquid', 'Nova Esports', 'Sandstorm',
    'Lazarus', 'Misfits Gaming', 'Complexity', 'Fnatic CR', 'Cloud9 Royals',
  ];
  const baseClans = region === 'TR' ? trClans : globalClans;
  const items = [];
  for (let i = 1; i <= 100; i++) {
    const base = baseClans[(i - 1) % baseClans.length];
    items.push({
      rank: i,
      name: i <= 10 ? base : `${base} #${i}`,
      tag: `#2Y8LC${100 + i}`,
      clanScore: 98500 - i * 165,
      members: 50 - (i % 4),
      location: {
        name: region === 'TR' ? 'Turkey' : 'International',
      },
    });
  }
  return { items };
}

function generateFallbackClan(tag, nameOverride) {
  const members = [];
  for (let i = 1; i <= 50; i++) {
    members.push({
      tag: `#2Y8L9${100 + i}`,
      name: i === 1 ? 'KralOyuncu TR' : i === 2 ? 'Bozkurt_34' : `Member_${i}`,
      role: i === 1 ? 'leader' : i <= 5 ? 'coLeader' : i <= 15 ? 'elder' : 'member',
      expLevel: 65 - Math.floor(i / 3),
      trophies: 9000 - i * 35,
      donations: 1250 - i * 18,
      donationsReceived: 980 - i * 15,
    });
  }
  return {
    tag: tag || '#2Y8L9Q',
    name: nameOverride || 'Anadolu Efsaneleri',
    type: 'open',
    description: 'Active Clan Wars & Ladder Community! Weekly donations and River Race participation required.',
    clanScore: 84620,
    clanWarTrophies: 4280,
    requiredTrophies: 7000,
    donationsPerWeek: 28450,
    members: 50,
    location: { name: 'Türkiye' },
    memberList: members,
  };
}

function readUserPrefs() {
  return readStore('user_prefs', PREFS_FILE, {
    lastTag: '#G9YV9GR8R',
    savedAccounts: [],
    savedDecks: [],
  });
}

function writeUserPrefs(prefs) {
  const current = readUserPrefs();
  const merged = { ...current, ...prefs };
  writeStore('user_prefs', PREFS_FILE, merged);
  return merged;
}

function fetchFromSupercell(endpoint, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CR_API_HOST,
      path: `/v1${endpoint}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getTurkeyLocationId(apiKey) {
  if (turkeyLocationId) return turkeyLocationId;
  try {
    const locRes = await fetchFromSupercell('/locations', apiKey);
    if (locRes.status === 200 && Array.isArray(locRes.data?.items)) {
      const tr = locRes.data.items.find(
        (l) => l.countryCode === 'TR' || l.name === 'Turkey' || l.name === 'Türkiye'
      );
      if (tr) {
        turkeyLocationId = tr.id;
        return turkeyLocationId;
      }
    }
  } catch (e) {}
  return 57000239;
}

function readPostBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 50000) reject(new Error('PAYLOAD_TOO_LARGE'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Basit Bellek İçi Hız Sınırlayıcı (Rate Limiter - Spam & Brute-Force Koruması)
const rateLimitBuckets = new Map();
function isRateLimited(req, bucketName, maxRequests = 30, windowMs = 60 * 1000) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local')
    .split(',')[0]
    .trim();
  const key = `${bucketName}:${ip}`;
  const now = Date.now();
  const entry = rateLimitBuckets.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitBuckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  if (entry.count > maxRequests) return true;
  return false;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, x-cr-api-key, Authorization, X-Voter-Id'
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const customKey = req.headers['x-cr-api-key'] || SUPERCELL_API_KEY;

  // GİZLİLİK POLİTİKASI SAYFASI (/privacy)
  if (url.pathname === '/privacy' || url.pathname === '/privacy-policy') {
    try {
      if (fs.existsSync(PRIVACY_FILE)) {
        const html = fs.readFileSync(PRIVACY_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }
    } catch (e) {}
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Royale HUB: Decks & Stats Privacy Policy');
  }

  // BULUT SAĞLIK KONTROLÜ (/health)
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(
      JSON.stringify({
        status: 'healthy',
        service: 'Royale HUB Live API',
        version: '8.0.0',
        persistentDb: CLOUD_STORE_ENABLED ? 'cloud' : 'local',
        uptime: process.uptime(),
        onlineCount: getOnlineUsers().length,
      })
    );
  }

  // İLETİŞİM & DESTEK MESAJLARI (/api/support)
  if (url.pathname === '/api/support') {
    if (req.method === 'GET') {
      const adminUser = getAuthUserFromRequest(req);
      if (!adminUser?.isAdmin) {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
      }
      const list = readStore('support_tickets', SUPPORT_FILE, []);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ count: list.length, items: list }));
    }
    if (req.method === 'POST') {
      if (isRateLimited(req, 'support_post', 8, 60 * 1000)) {
        res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'RATE_LIMITED' }));
      }
      try {
        const parsed = await readPostBody(req);
        const messageText = String(parsed.message || '').trim().slice(0, 1000);
        if (messageText.length < 5) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'MESSAGE_TOO_SHORT' }));
        }
        const authUser = getAuthUserFromRequest(req);
        const list = [...readStore('support_tickets', SUPPORT_FILE, [])];
        const ticket = {
          id: 'SUP-' + Date.now().toString().slice(-6),
          userId: authUser?.userId || null,
          userName: authUser?.displayName || null,
          userTag: authUser?.tag || null,
          topic: String(parsed.topic || 'Genel Destek').slice(0, 60),
          contact: String(parsed.contact || '').slice(0, 120),
          playerTag: String(parsed.playerTag || authUser?.tag || '').slice(0, 20),
          message: messageText,
          adminReply: null,
          repliedAt: null,
          createdAt: new Date().toISOString(),
        };
        list.unshift(ticket);
        writeStore('support_tickets', SUPPORT_FILE, list.slice(0, 200));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, ticketId: ticket.id }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
      }
    }
  }

  // 1) E-POSTA İLE KAYIT OL (KURTARMA KELİMELİ & ZORUNLU CLASH ROYALE #TAG) (/api/auth/register)
  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    if (isRateLimited(req, 'auth_register', 10, 60 * 1000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'RATE_LIMITED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const email = String(parsed.email || '').trim().toLowerCase();
      const password = String(parsed.password || '');
      const recoveryAnswer = String(parsed.recoveryAnswer || '').trim().toLowerCase();
      let optTag = String(parsed.tag || '').trim().toUpperCase().replace(/^O/, '0');

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'INVALID_EMAIL' }));
      }
      if (password.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'PASSWORD_TOO_SHORT' }));
      }
      if (recoveryAnswer.length < 2) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'RECOVERY_REQUIRED' }));
      }
      if (!optTag) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'CR_TAG_REQUIRED' }));
      }
      if (!optTag.startsWith('#')) optTag = `#${optTag}`;
      if (!/^#[0-9A-Z]{3,14}$/.test(optTag)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'INVALID_CR_TAG' }));
      }

      const users = [...readStore('auth_users', USERS_FILE, [])];
      if (users.some((u) => u.email === email)) {
        res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'EMAIL_ALREADY_EXISTS' }));
      }

      let crMeta = { tag: optTag, trophies: null, clanName: null };
      let crPlayerName = optTag;
      try {
        const scRes = await fetchFromSupercell(`/players/${encodeURIComponent(optTag)}`, customKey);
        if (scRes.status === 404) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'TAG_NOT_FOUND' }));
        }
        if (scRes.status === 200 && scRes.data?.tag) {
          crMeta = {
            tag: scRes.data.tag,
            trophies: typeof scRes.data.trophies === 'number' ? scRes.data.trophies : null,
            clanName: scRes.data.clan?.name || null,
          };
          if (scRes.data.name) {
            crPlayerName = sanitizeChatText(scRes.data.name, 24) || scRes.data.tag;
          }
        }
      } catch (e) {}

      const salt = crypto.randomBytes(16).toString('hex');
      const userId = 'u-' + crypto.randomBytes(8).toString('hex');
      const newRecord = {
        userId,
        email,
        username: crPlayerName,
        salt,
        passwordHash: hashPin(password, salt),
        recoveryHash: hashPin(recoveryAnswer, salt),
        ...crMeta,
        createdAt: new Date().toISOString(),
      };
      users.push(newRecord);
      writeStore('auth_users', USERS_FILE, users);

      const user = {
        userId,
        authType: 'cr',
        displayName: crPlayerName,
        email,
        ...crMeta,
        isAdmin: isUserAdmin({ email, tag: crMeta.tag }),
      };
      const token = createSession(user);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, token, user }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 2) E-POSTA İLE GİRİŞ YAP (/api/auth/login)
  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    if (isRateLimited(req, 'auth_login', 15, 60 * 1000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'RATE_LIMITED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const email = String(parsed.email || '').trim().toLowerCase();
      const password = String(parsed.password || '');
      const users = [...readStore('auth_users', USERS_FILE, [])];
      const idx = users.findIndex((u) => u.email === email);
      if (idx < 0 || !verifyPin(password, users[idx].salt, users[idx].passwordHash)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'INVALID_CREDENTIALS' }));
      }

      const found = users[idx];
      if (found.banned) {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'ACCOUNT_BANNED' }));
      }
      if (found.tag) {
        try {
          const scRes = await fetchFromSupercell(`/players/${encodeURIComponent(found.tag)}`, customKey);
          if (scRes.status === 200 && scRes.data?.tag) {
            if (scRes.data.name) {
              found.username = sanitizeChatText(scRes.data.name, 24) || found.username;
            }
            found.trophies = typeof scRes.data.trophies === 'number' ? scRes.data.trophies : found.trophies;
            found.clanName = scRes.data.clan?.name || found.clanName;
            users[idx] = found;
            writeStore('auth_users', USERS_FILE, users);
          }
        } catch (e) {}
      }

      const user = {
        userId: found.userId,
        authType: found.tag ? 'cr' : 'email',
        displayName: found.username,
        email: found.email,
        tag: found.tag || null,
        trophies: typeof found.trophies === 'number' ? found.trophies : null,
        clanName: found.clanName || null,
        isAdmin: isUserAdmin(found),
      };
      const token = createSession(user);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, token, user }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 3) ŞİFRE SIFIRLAMA / KURTARMA (/api/auth/forgot-password)
  if (url.pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    try {
      const parsed = await readPostBody(req);
      const email = String(parsed.email || '').trim().toLowerCase();
      const recoveryAnswer = String(parsed.recoveryAnswer || '').trim().toLowerCase();
      const newPassword = String(parsed.newPassword || '');

      if (newPassword.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'PASSWORD_TOO_SHORT' }));
      }
      const users = [...readStore('auth_users', USERS_FILE, [])];
      const idx = users.findIndex((u) => u.email === email);
      if (idx < 0) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'ACCOUNT_NOT_FOUND' }));
      }
      const found = users[idx];
      if (!found.recoveryHash || !verifyPin(recoveryAnswer, found.salt, found.recoveryHash)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'WRONG_RECOVERY' }));
      }

      found.passwordHash = hashPin(newPassword, found.salt);
      users[idx] = found;
      writeStore('auth_users', USERS_FILE, users);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 4) PROFİLE CLASH ROYALE #TAG ROZETİ BAĞLA (/api/auth/link-tag)
  if (url.pathname === '/api/auth/link-tag' && req.method === 'POST') {
    const authUser = getAuthUserFromRequest(req);
    if (!authUser) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'UNAUTHORIZED' }));
    }
    try {
      const parsed = await readPostBody(req);
      let optTag = String(parsed.tag || '').trim().toUpperCase().replace(/^O/, '0');
      let crMeta = { tag: null, trophies: null, clanName: null };

      if (optTag) {
        if (!optTag.startsWith('#')) optTag = `#${optTag}`;
        const scRes = await fetchFromSupercell(`/players/${encodeURIComponent(optTag)}`, customKey);
        if (scRes.status === 200 && scRes.data?.tag) {
          crMeta = {
            tag: scRes.data.tag,
            trophies: typeof scRes.data.trophies === 'number' ? scRes.data.trophies : null,
            clanName: scRes.data.clan?.name || null,
          };
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'TAG_NOT_FOUND' }));
        }
      }

      const users = [...readStore('auth_users', USERS_FILE, [])];
      const idx = users.findIndex((u) => u.userId === authUser.userId);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...crMeta };
        writeStore('auth_users', USERS_FILE, users);
      }

      const updatedUser = {
        ...authUser,
        authType: crMeta.tag ? 'cr' : 'email',
        ...crMeta,
      };
      const sessions = { ...readStore('auth_sessions', SESSIONS_FILE, {}) };
      Object.keys(sessions).forEach((tok) => {
        if (sessions[tok]?.userId === authUser.userId) {
          sessions[tok] = { ...sessions[tok], ...updatedUser };
        }
      });
      writeStore('auth_sessions', SESSIONS_FILE, sessions);
      touchPresence(updatedUser);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, user: updatedUser }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 5) OTURUM DOĞRULAMA, ÇIKIŞ & HESAP/VERİ SİLME
  if (url.pathname === '/api/auth/me' && req.method === 'GET') {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'UNAUTHORIZED' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, user, onlineUsers: getOnlineUsers() }));
  }

  if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = getBearerToken(req);
    if (token) {
      const sessions = { ...readStore('auth_sessions', SESSIONS_FILE, {}) };
      const user = sessions[token];
      if (user?.userId) activePresenceMap.delete(user.userId);
      delete sessions[token];
      writeStore('auth_sessions', SESSIONS_FILE, sessions);
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (url.pathname === '/api/auth/delete-account' && req.method === 'POST') {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'UNAUTHORIZED' }));
    }
    // 1. Kullanıcı kaydını kalıcı sil
    const users = readStore('auth_users', USERS_FILE, []).filter(
      (u) => u.userId !== user.userId
    );
    writeStore('auth_users', USERS_FILE, users);

    // 2. Aktif oturumları ve canlı aktiflik kaydını sil
    const sessions = { ...readStore('auth_sessions', SESSIONS_FILE, {}) };
    Object.keys(sessions).forEach((tok) => {
      if (sessions[tok]?.userId === user.userId) {
        delete sessions[tok];
      }
    });
    writeStore('auth_sessions', SESSIONS_FILE, sessions);
    activePresenceMap.delete(user.userId);

    // 3. Kullanıcının küresel sohbet mesajlarını ve paylaştığı desteleri kalıcı sil
    const chatList = readStore('global_chat', GLOBAL_CHAT_FILE, []).filter(
      (m) => m.userId !== user.userId
    );
    writeStore('global_chat', GLOBAL_CHAT_FILE, chatList);

    const shareList = readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares()).filter(
      (d) => d.userId !== user.userId
    );
    writeStore('deck_shares', DECK_SHARES_FILE, shareList);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, deleted: true }));
  }

  // 3) CANLI AKTİFLİK NABZI (/api/presence/ping)
  if (url.pathname === '/api/presence/ping' && req.method === 'POST') {
    const user = getAuthUserFromRequest(req);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(
      JSON.stringify({
        ok: true,
        authenticated: Boolean(user),
        onlineUsers: getOnlineUsers(),
      })
    );
  }

  // 4) CLASH OF CLANS TARZI KÜRESEL SOHBET (/api/global-chat)
  if (url.pathname === '/api/global-chat') {
    getAuthUserFromRequest(req);
    const chatMessages = readStore('global_chat', GLOBAL_CHAT_FILE, []);
    if (req.method === 'GET') {
      const visible = chatMessages.slice(0, 60);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          onlineUsers: getOnlineUsers(),
          messages: visible,
        })
      );
    }
    if (req.method === 'POST') {
      const user = getAuthUserFromRequest(req);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'AUTH_REQUIRED' }));
      }
      try {
        const parsed = await readPostBody(req);
        const cleanText = sanitizeChatText(parsed.text, 240);
        if (cleanText.length < 1) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'EMPTY_MESSAGE' }));
        }
        const newMsg = {
          id: 'gc-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          userId: user.userId,
          authType: user.tag ? 'cr' : 'email',
          author: user.displayName,
          tag: user.tag || null,
          trophies: typeof user.trophies === 'number' ? user.trophies : null,
          clanName: user.clanName || null,
          isAdmin: Boolean(user.isAdmin || isUserAdmin(user)),
          text: cleanText,
          createdAt: new Date().toISOString(),
          reports: 0,
        };
        const updated = [newMsg, ...chatMessages].slice(0, 120);
        writeStore('global_chat', GLOBAL_CHAT_FILE, updated);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(
          JSON.stringify({ ok: true, message: newMsg, onlineUsers: getOnlineUsers() })
        );
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
      }
    }
  }

  if (url.pathname === '/api/global-chat/report' && req.method === 'POST') {
    try {
      const reporter = getAuthUserFromRequest(req);
      const parsed = await readPostBody(req);
      const reason = sanitizeChatText(parsed.reason || '', 300);
      if (reason.length < 3) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'REASON_REQUIRED' }));
      }
      const reporterKey =
        reporter?.userId ||
        String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon');
      const chatMessages = [...readStore('global_chat', GLOBAL_CHAT_FILE, [])];
      const target = chatMessages.find((m) => m.id === parsed.messageId);
      if (target) {
        const reportedBy = Array.isArray(target.reportedBy) ? target.reportedBy : [];
        if (!reportedBy.includes(reporterKey)) {
          reportedBy.push(reporterKey);
          target.reportedBy = reportedBy;
          target.reports = reportedBy.length;
          writeStore('global_chat', GLOBAL_CHAT_FILE, chatMessages);
        }
      }
      const adminReports = [...readStore('admin_reports', ADMIN_REPORTS_FILE, [])];
      adminReports.unshift({
        id: 'rep-' + Date.now(),
        type: 'chat',
        targetId: parsed.messageId || null,
        targetAuthor: target?.author || 'Bilinmeyen',
        targetAuthorTag: target?.tag || null,
        targetContent: target?.text || '',
        reason,
        reportedByUserId: reporter?.userId || null,
        reportedByName: reporter?.displayName || 'Kullanıcı',
        reportedByTag: reporter?.tag || null,
        createdAt: new Date().toISOString(),
      });
      writeStore('admin_reports', ADMIN_REPORTS_FILE, adminReports.slice(0, 500));

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 5) AYRI DESTE PAYLAŞIM MERKEZİ (/api/deck-shares)
  if (url.pathname === '/api/deck-shares') {
    getAuthUserFromRequest(req);
    const shares = readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares());
    if (req.method === 'GET') {
      const visible = shares.slice(0, 60);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ items: visible }));
    }
    if (req.method === 'POST') {
      const user = getAuthUserFromRequest(req);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'AUTH_REQUIRED' }));
      }
      try {
        const parsed = await readPostBody(req);
        const deckIds = Array.isArray(parsed.deckIds)
          ? parsed.deckIds.map((x) => Number(x)).filter(Boolean).slice(0, 8)
          : [];
        if (deckIds.length < 8) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'INVALID_DECK' }));
        }
        const title = sanitizeChatText(parsed.title || 'Arena Destesi', 60) || 'Arena Destesi';
        const description = sanitizeChatText(parsed.description || '', 300);
        if (description.length < 3) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'DESCRIPTION_TOO_SHORT' }));
        }
        const entry = {
          id: 'ds-' + Date.now(),
          userId: user.userId,
          author: user.displayName,
          authorTag: user.tag || null,
          trophies: typeof user.trophies === 'number' ? user.trophies : null,
          isAdmin: Boolean(user.isAdmin || isUserAdmin(user)),
          title,
          description,
          avgElixir: String(parsed.avgElixir || '3.8').slice(0, 6),
          deckIds,
          likes: 0,
          createdAt: new Date().toISOString(),
          reports: 0,
        };
        const updated = [entry, ...shares].slice(0, 80);
        writeStore('deck_shares', DECK_SHARES_FILE, updated);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, item: entry }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
      }
    }
  }

  if (url.pathname === '/api/deck-shares/like' && req.method === 'POST') {
    if (isRateLimited(req, 'deck_like', 40, 60 * 1000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'RATE_LIMITED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const isUnlike = parsed.action === 'unlike';
      const shares = [...readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares())];
      const target = shares.find((d) => d.id === parsed.deckShareId);
      if (target) {
        target.likes = isUnlike
          ? Math.max(0, (target.likes || 0) - 1)
          : (target.likes || 0) + 1;
        writeStore('deck_shares', DECK_SHARES_FILE, shares);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, likes: target?.likes || 0, liked: !isUnlike }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/deck-shares/report' && req.method === 'POST') {
    try {
      const reporter = getAuthUserFromRequest(req);
      const parsed = await readPostBody(req);
      const reason = sanitizeChatText(parsed.reason || '', 300);
      if (reason.length < 3) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'REASON_REQUIRED' }));
      }
      const reporterKey =
        reporter?.userId ||
        String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon');
      const shares = [...readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares())];
      const target = shares.find((d) => d.id === parsed.deckShareId);
      if (target) {
        const reportedBy = Array.isArray(target.reportedBy) ? target.reportedBy : [];
        if (!reportedBy.includes(reporterKey)) {
          reportedBy.push(reporterKey);
          target.reportedBy = reportedBy;
          target.reports = reportedBy.length;
          writeStore('deck_shares', DECK_SHARES_FILE, shares);
        }
      }
      const adminReports = [...readStore('admin_reports', ADMIN_REPORTS_FILE, [])];
      adminReports.unshift({
        id: 'rep-' + Date.now(),
        type: 'deck_share',
        targetId: parsed.deckShareId || null,
        targetAuthor: target?.author || 'Bilinmeyen',
        targetAuthorTag: target?.authorTag || null,
        targetContent: target ? `${target.title} — ${target.description}` : '',
        reason,
        reportedByUserId: reporter?.userId || null,
        reportedByName: reporter?.displayName || 'Kullanıcı',
        reportedByTag: reporter?.tag || null,
        createdAt: new Date().toISOString(),
      });
      writeStore('admin_reports', ADMIN_REPORTS_FILE, adminReports.slice(0, 500));

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 5.5) YÖNETİCİYE ÖZEL ADMIN PANELİ UÇ NOKTALARI (/api/admin/*)
  if (url.pathname === '/api/admin/reports' && req.method === 'GET') {
    const adminUser = getAuthUserFromRequest(req);
    const adminSecret = process.env.ADMIN_SECRET || '';
    const hasSecret = adminSecret && req.headers['x-admin-secret'] === adminSecret;
    if (!hasSecret && !adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    const items = readStore('admin_reports', ADMIN_REPORTS_FILE, []).filter(
      (r) => !r.hiddenByAdmin
    );
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, total: items.length, items }));
  }

  if (url.pathname === '/api/admin/reports/resolve' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const reports = [...readStore('admin_reports', ADMIN_REPORTS_FILE, [])];
      const idx = reports.findIndex((r) => r.id === parsed.reportId);
      const targetReport = idx >= 0 ? reports[idx] : null;
      if (parsed.deleteContent && targetReport) {
        if (targetReport.type === 'chat') {
          const msgs = readStore('global_chat', GLOBAL_CHAT_FILE, []).filter(
            (m) => m.id !== targetReport.targetId
          );
          writeStore('global_chat', GLOBAL_CHAT_FILE, msgs);
        } else if (targetReport.type === 'deck_share') {
          const shares = readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares()).filter(
            (d) => d.id !== targetReport.targetId
          );
          writeStore('deck_shares', DECK_SHARES_FILE, shares);
        }
      }
      if (idx >= 0) {
        reports[idx].status = 'closed';
        reports[idx].hiddenByAdmin = true;
      }
      writeStore('admin_reports', ADMIN_REPORTS_FILE, reports);
      const visible = reports.filter((r) => !r.hiddenByAdmin);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, items: visible }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/chat/delete' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const msgs = readStore('global_chat', GLOBAL_CHAT_FILE, []).filter(
        (m) => m.id !== parsed.messageId
      );
      writeStore('global_chat', GLOBAL_CHAT_FILE, msgs);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/deck-shares/delete' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const shares = readStore('deck_shares', DECK_SHARES_FILE, getDefaultDeckShares()).filter(
        (d) => d.id !== parsed.deckShareId
      );
      writeStore('deck_shares', DECK_SHARES_FILE, shares);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/news/add' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const title = String(parsed.title || '').trim().slice(0, 140);
      const summary = String(parsed.summary || '').trim().slice(0, 600);
      const tag = String(parsed.tag || '📢 DUYURU').trim().slice(0, 40);
      if (title.length < 3 || summary.length < 5) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'NEWS_FIELDS_REQUIRED' }));
      }
      const existing = readStore('remote_news', NEWS_FILE, DEFAULT_NEWS_ITEMS);
      const nowIso = new Date().toISOString();
      const entry = {
        id: 'news-' + Date.now(),
        tag,
        tagEn: tag,
        tagColor: '#FFB800',
        publishedAt: nowIso,
        date: new Date(nowIso).toLocaleString('tr-TR'),
        dateEn: new Date(nowIso).toLocaleString('en-US'),
        title,
        titleEn: title,
        summary,
        summaryEn: summary,
        highlights: [],
        highlightsEn: [],
      };
      const updated = [entry, ...(Array.isArray(existing) ? existing : DEFAULT_NEWS_ITEMS)].slice(0, 40);
      writeStore('remote_news', NEWS_FILE, updated);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, item: entry, items: updated }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/news/delete' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const existing = readStore('remote_news', NEWS_FILE, DEFAULT_NEWS_ITEMS);
      const updated = (Array.isArray(existing) ? existing : DEFAULT_NEWS_ITEMS).filter(
        (n) => n.id !== parsed.newsId
      );
      writeStore('remote_news', NEWS_FILE, updated);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, items: updated }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/support' && req.method === 'GET') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    const items = readStore('support_tickets', SUPPORT_FILE, []).filter(
      (t) => !t.hiddenByAdmin
    );
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, items }));
  }

  if (url.pathname === '/api/my-tickets' && req.method === 'GET') {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'UNAUTHORIZED' }));
    }
    const tickets = readStore('support_tickets', SUPPORT_FILE, []).filter(
      (t) => t.userId === user.userId
    );
    const reports = readStore('admin_reports', ADMIN_REPORTS_FILE, []).filter(
      (r) => r.reportedByUserId === user.userId
    );
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, tickets, reports }));
  }

  if (url.pathname === '/api/admin/support/reply' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const reply = String(parsed.reply || '').trim().slice(0, 600);
      if (reply.length < 2) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'REPLY_REQUIRED' }));
      }
      const list = [...readStore('support_tickets', SUPPORT_FILE, [])];
      const idx = list.findIndex((t) => t.id === parsed.ticketId);
      if (idx >= 0) {
        list[idx].adminReply = reply;
        list[idx].repliedAt = new Date().toISOString();
        list[idx].repliedBy = adminUser.displayName;
        list[idx].status = 'replied';
        writeStore('support_tickets', SUPPORT_FILE, list);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, items: list.filter((t) => !t.hiddenByAdmin) }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/reports/reply' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const reply = String(parsed.reply || '').trim().slice(0, 600);
      if (reply.length < 2) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'REPLY_REQUIRED' }));
      }
      const list = [...readStore('admin_reports', ADMIN_REPORTS_FILE, [])];
      const idx = list.findIndex((r) => r.id === parsed.reportId);
      if (idx >= 0) {
        list[idx].adminReply = reply;
        list[idx].repliedAt = new Date().toISOString();
        list[idx].repliedBy = adminUser.displayName;
        list[idx].status = 'replied';
        writeStore('admin_reports', ADMIN_REPORTS_FILE, list);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, items: list.filter((r) => !r.hiddenByAdmin) }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/support/resolve' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const list = [...readStore('support_tickets', SUPPORT_FILE, [])];
      const idx = list.findIndex((t) => t.id === parsed.ticketId);
      if (idx >= 0) {
        list[idx].status = 'closed';
        list[idx].hiddenByAdmin = true;
        writeStore('support_tickets', SUPPORT_FILE, list);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, items: list.filter((t) => !t.hiddenByAdmin) }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/admin/users' && req.method === 'GET') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    const users = readStore('auth_users', USERS_FILE, []).map((u) => ({
      userId: u.userId,
      displayName: u.username,
      email: u.email,
      tag: u.tag || null,
      trophies: typeof u.trophies === 'number' ? u.trophies : null,
      banned: Boolean(u.banned),
      isAdmin: isUserAdmin(u),
      createdAt: u.createdAt,
    }));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, items: users }));
  }

  if (url.pathname === '/api/admin/users/ban' && req.method === 'POST') {
    const adminUser = getAuthUserFromRequest(req);
    if (!adminUser?.isAdmin) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ADMIN_REQUIRED' }));
    }
    try {
      const parsed = await readPostBody(req);
      const users = [...readStore('auth_users', USERS_FILE, [])];
      const idx = users.findIndex((u) => u.userId === parsed.userId);
      if (idx < 0 || isUserAdmin(users[idx])) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'CANNOT_BAN_TARGET' }));
      }
      users[idx].banned = Boolean(parsed.banned);
      writeStore('auth_users', USERS_FILE, users);
      if (users[idx].banned) {
        const sessions = { ...readStore('auth_sessions', SESSIONS_FILE, {}) };
        Object.keys(sessions).forEach((tok) => {
          if (sessions[tok]?.userId === users[idx].userId) delete sessions[tok];
        });
        writeStore('auth_sessions', SESSIONS_FILE, sessions);
        activePresenceMap.delete(users[idx].userId);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, banned: users[idx].banned }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  // 0) KULLANICI TERCİHLERİNİ OKU / KAYDET (/api/prefs)
  if (url.pathname === '/api/prefs') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(readUserPrefs()));
    }
    if (req.method === 'POST') {
      try {
        const parsed = await readPostBody(req);
        const updated = writeUserPrefs(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(updated));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'BAD_JSON' }));
      }
    }
  }

  // 1) TÜM RESMİ KARTLARI GETİR (/api/cards)
  if (url.pathname === '/api/cards') {
    try {
      if (cachedCards) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(cachedCards));
      }
      const cardsRes = await fetchFromSupercell('/cards', customKey);
      if (cardsRes.status === 200 && cardsRes.data?.items) {
        cachedCards = cardsRes.data;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(cardsRes.data));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ items: [] }));
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ items: [] }));
    }
  }

function buildFallbackArenaDecks(arenaNum) {
  const mkCard = (slug, fallbackNameTr, fallbackNameEn, fallbackId, fallbackElixir, rarityFolder = 'common') => {
    const cleanSlug = slug.toLowerCase();
    const officialArr = Array.isArray(cachedCards) ? cachedCards : (cachedCards?.items || []);
    const sc = officialArr.find(
      (c) => String(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_') === cleanSlug
    );
    const lc =
      LOCAL_CARD_BY_SLUG.get(cleanSlug) ||
      LOCAL_CARD_BY_SLUG.get(cleanSlug.replace(/_/g, ''));
    return {
      id: sc?.id || lc?.id || fallbackId,
      name: lc?.name || fallbackNameTr,
      nameEn: sc?.name || lc?.nameEn || fallbackNameEn,
      elixir: sc?.elixirCost || lc?.elixir || fallbackElixir,
      rarity: sc?.rarity || lc?.rarity || rarityFolder,
      iconUrl:
        lc?.iconUrl ||
        sc?.iconUrls?.medium ||
        `https://deckmelon.com/static/images/cards/edited/${rarityFolder}/${cleanSlug}.png`,
    };
  };

  const PRESETS_BY_ARENA = {
    0: [
      {
        title: 'Kraliyet Başlangıç Dev & Silahşör',
        winRate: 58.4,
        matches: '14.2k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Hızlı Şövalye & Mini P.E.K.K.A Baskısı',
        winRate: 56.9,
        matches: '11.8k',
        cards: [
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
        ],
      },
      {
        title: 'Hava Destekli Dev Push (Eğitim Kampı)',
        winRate: 55.2,
        matches: '9.4k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Kule Savunma & Çift Büyü Eğitim Destesi',
        winRate: 54.6,
        matches: '7.6k',
        cards: [
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
    ],
    1: [
      {
        title: 'Goblin Kafesi & Dev Kontrol (1. Arena)',
        winRate: 60.4,
        matches: '18.5k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('goblin_cage', 'Goblin Kafesi', 'Goblin Cage', 27000012, 4, 'rare'),
          mkCard('goblins', 'Goblinler', 'Goblins', 26000002, 2, 'common'),
          mkCard('spear_goblins', 'Mızraklı Goblinler', 'Spear Goblins', 26000019, 2, 'common'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Goblin Kulübesi & Şövalye Sürü Baskısı',
        winRate: 58.9,
        matches: '15.3k',
        cards: [
          mkCard('goblin_hut', 'Goblin Kulübesi', 'Goblin Hut', 27000001, 5, 'rare'),
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('goblins', 'Goblinler', 'Goblins', 26000002, 2, 'common'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Hızlı 3.0 Goblin & Mini P.E.K.K.A Döngüsü',
        winRate: 57.6,
        matches: '12.1k',
        cards: [
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('knight', 'Şövalye', 'Knight', 26000000, 3, 'common'),
          mkCard('goblins', 'Goblinler', 'Goblins', 26000002, 2, 'common'),
          mkCard('spear_goblins', 'Mızraklı Goblinler', 'Spear Goblins', 26000019, 2, 'common'),
          mkCard('goblin_cage', 'Goblin Kafesi', 'Goblin Cage', 27000012, 4, 'rare'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
        ],
      },
      {
        title: 'Dev + Goblin Ordusu Çift Kulvar',
        winRate: 56.8,
        matches: '10.4k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('goblin_hut', 'Goblin Kulübesi', 'Goblin Hut', 27000001, 5, 'rare'),
          mkCard('spear_goblins', 'Mızraklı Goblinler', 'Spear Goblins', 26000019, 2, 'common'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
    ],
    2: [
      {
        title: 'Valkür + İskelet Mezar Taşı Kontrol (2. Arena)',
        winRate: 61.2,
        matches: '19.8k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('valkyrie', 'Valkür', 'Valkyrie', 26000011, 4, 'rare'),
          mkCard('bomber', 'Bombacı', 'Bomber', 26000013, 2, 'common'),
          mkCard('skeletons', 'İskeletler', 'Skeletons', 26000010, 1, 'common'),
          mkCard('tombstone', 'Mezar Taşı', 'Tombstone', 27000009, 3, 'rare'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Bombacı & Mini P.E.K.K.A Kemik Çukuru',
        winRate: 59.5,
        matches: '16.1k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('mini_pekka', 'Mini P.E.K.K.A', 'Mini P.E.K.K.A', 26000018, 4, 'rare'),
          mkCard('valkyrie', 'Valkür', 'Valkyrie', 26000011, 4, 'rare'),
          mkCard('bomber', 'Bombacı', 'Bomber', 26000013, 2, 'common'),
          mkCard('minions', 'Minyonlar', 'Minions', 26000005, 3, 'common'),
          mkCard('skeletons', 'İskeletler', 'Skeletons', 26000010, 1, 'common'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
        ],
      },
      {
        title: 'Hızlı İskelet Döngüsü & Valkür Savunma',
        winRate: 58.1,
        matches: '13.7k',
        cards: [
          mkCard('valkyrie', 'Valkür', 'Valkyrie', 26000011, 4, 'rare'),
          mkCard('musketeer', 'Silahşör', 'Musketeer', 26000014, 4, 'rare'),
          mkCard('tombstone', 'Mezar Taşı', 'Tombstone', 27000009, 3, 'rare'),
          mkCard('bomber', 'Bombacı', 'Bomber', 26000013, 2, 'common'),
          mkCard('skeletons', 'İskeletler', 'Skeletons', 26000010, 1, 'common'),
          mkCard('goblins', 'Goblinler', 'Goblins', 26000002, 2, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
      {
        title: 'Goblin Kafesi + Bombacı Karşı Atak',
        winRate: 57.4,
        matches: '11.2k',
        cards: [
          mkCard('giant', 'Dev', 'Giant', 26000003, 5, 'rare'),
          mkCard('goblin_cage', 'Goblin Kafesi', 'Goblin Cage', 27000012, 4, 'rare'),
          mkCard('bomber', 'Bombacı', 'Bomber', 26000013, 2, 'common'),
          mkCard('valkyrie', 'Valkür', 'Valkyrie', 26000011, 4, 'rare'),
          mkCard('archers', 'Okçular', 'Archers', 26000001, 3, 'common'),
          mkCard('spear_goblins', 'Mızraklı Goblinler', 'Spear Goblins', 26000019, 2, 'common'),
          mkCard('fireball', 'Alev Topu', 'Fireball', 28000000, 4, 'rare'),
          mkCard('arrows', 'Oklar', 'Arrows', 28000001, 3, 'common'),
        ],
      },
    ],
  };

  const selected = PRESETS_BY_ARENA[arenaNum] || PRESETS_BY_ARENA[1];
  return selected.map((d, idx) => {
    const avg = (
      d.cards.reduce((s, c) => s + (c.elixir || 3), 0) / d.cards.length
    ).toFixed(1);
    return {
      id: `rh-api-arena-${arenaNum}-${idx + 1}`,
      arenaNum,
      title: d.title,
      titleEn: d.title,
      winRate: d.winRate,
      matchesCount: d.matches,
      avgElixir: avg,
      cards: d.cards,
    };
  });
}

function parseDeckMelonPage(html, arenaNum, limit = 30) {
  const cardBySlug = new Map();
  const officialCardList = Array.isArray(cachedCards)
    ? cachedCards
    : Array.isArray(cachedCards?.items)
    ? cachedCards.items
    : [];
  officialCardList.forEach((c) => {
    const slug = String(c.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    cardBySlug.set(slug, c);
    cardBySlug.set(slug.replace(/_/g, ''), c);
  });
  const aliasMap = {
    log: 'the_log',
    pekka: 'p_e_k_k_a',
    mini_pekka: 'mini_p_e_k_k_a',
    x_bow: 'x_bow',
    goblin_drill: 'goblin_drill',
    minion_giant: 'mega_minion',
  };
  const items = [];
  if (!html) return items;
  const blocks = html.split('<a href="/tr/best-decks/');
  for (let i = 1; i < blocks.length && items.length < limit; i++) {
    const blk = blocks[i];
    const slugMatch = blk.match(/^([^"]+)"/);
    const slug = slugMatch ? slugMatch[1] : '';
    if (!slug || slug.startsWith('arena-') || slug.includes('?')) continue;
    const endIdx = blk.indexOf('</a>');
    const inner = endIdx > 0 ? blk.slice(0, endIdx) : blk.slice(0, 3500);
    const imgMatches = [
      ...inner.matchAll(
        /src="([^"]*\/cards\/edited\/([^"]*)\/([a-z0-9_]+)\.png[^"]*)"\s+alt="([^"]+)"/gi
      ),
    ];
    if (imgMatches.length < 8) continue;

    const cards = imgMatches.slice(0, 8).map((m) => {
      const folder = String(m[2] || '').toLowerCase();
      const rawFile = m[3].toLowerCase();
      const altTr = m[4];
      const lookupKey = aliasMap[rawFile] || rawFile;
      const sc =
        cardBySlug.get(lookupKey) ||
        cardBySlug.get(lookupKey.replace(/_/g, ''));
      const lc =
        LOCAL_CARD_BY_SLUG.get(rawFile) ||
        LOCAL_CARD_BY_SLUG.get(lookupKey) ||
        LOCAL_CARD_BY_SLUG.get(rawFile.replace(/_/g, ''));
      const isEvo = folder.includes('evolution');
      const isHero = folder.includes('hero');
      return {
        id: sc?.id || lc?.id || 26000000,
        name: lc?.name || altTr.replace(/\s*(Evrim|Kahraman)\s*$/i, ''),
        nameEn: sc?.name || lc?.nameEn || altTr,
        elixir: sc?.elixirCost || lc?.elixir || 3,
        evo: isEvo,
        hero: isHero,
        rarity: sc?.rarity || lc?.rarity || 'common',
        iconUrl:
          (isEvo ? lc?.evoIconUrl : isHero ? lc?.heroIconUrl : null) ||
          sc?.iconUrls?.medium ||
          lc?.iconUrl ||
          `https://deckmelon.com/static/images/cards/edited/${folder}/${rawFile}.png`,
      };
    });
    const h4Match = inner.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
    const h4Title = h4Match ? h4Match[1].replace(/<[^>]+>/g, '').trim() : '';
    const wrMatch = inner.match(/%([0-9]{1,2}(?:\.[0-9])?)\s*(?:<\/span>\s*)?kazanma/i);
    const battlesMatch = inner.match(/([0-9.,]+k?)\s*savaş/i);
    const avg = (
      cards.reduce((s, c) => s + (c.elixir || 3), 0) / cards.length
    ).toFixed(1);
    const titleClean =
      h4Title ||
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    items.push({
      id: `rh-${arenaNum}-${i}-${slug}`,
      arenaNum,
      title: titleClean,
      titleEn: titleClean,
      winRate: wrMatch ? parseFloat(wrMatch[1]) : 55.0,
      matchesCount: battlesMatch ? battlesMatch[1] : '5.2k',
      avgElixir: avg,
      cards,
    });
  }
  // Kaynak sıralamayla birebir aynı olmaması için desteleri karıştır (Fisher-Yates)
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function summarizeDeckRatings(voterKey) {
  const store = readStore('deck_ratings', DECK_RATINGS_FILE, {});
  const summaries = {};
  const topRated = [];
  Object.entries(store).forEach(([deckId, record]) => {
    const votesObj = record?.votes || {};
    const values = Object.values(votesObj).filter((v) => v >= 1 && v <= 5);
    const voteCount = values.length;
    if (voteCount === 0) return;
    const sum = values.reduce((a, b) => a + b, 0);
    const avgRating = Number((sum / voteCount).toFixed(1));
    const userVote = voterKey && votesObj[voterKey] ? votesObj[voterKey] : 0;
    summaries[deckId] = { avgRating, voteCount, userVote };
    if (record.deck) {
      topRated.push({
        ...record.deck,
        id: deckId,
        avgRating,
        voteCount,
        userVote,
        scoreRank: avgRating * 100 + Math.min(voteCount, 25) * 3,
      });
    }
  });
  topRated.sort((a, b) => b.scoreRank - a.scoreRank || b.voteCount - a.voteCount);
  return { summaries, topRated };
}

  // 1.4) DECKMELON CANLI ARENA DESTELERİ (/api/arena-decks?arena=0..32&page=1..N) & GENEL META (/api/meta-decks?page=1..65)
  if (url.pathname === '/api/meta-decks' && req.method === 'GET') {
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const forceRefresh = url.searchParams.get('refresh') === '1';
    const cacheKey = `meta-p${pageNum}`;
    const cached = arenaDecksCache.get(cacheKey);
    if (!forceRefresh && cached && Date.now() - cached.ts < 15 * 60 * 1000) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({ ok: true, page: pageNum, totalPages: cached.totalPages, items: cached.items })
      );
    }
    try {
      const targetUrl =
        pageNum === 1
          ? 'https://deckmelon.com/tr/best-decks'
          : `https://deckmelon.com/tr/best-decks/page-${pageNum}`;
      const pageRes = await fetchHttpsText(targetUrl);
      const items = pageRes.status === 200 ? parseDeckMelonPage(pageRes.html, 'meta', 50) : [];
      const pageNums = [...(pageRes.html || '').matchAll(/\/tr\/best-decks\/page-(\d+)/g)].map((m) =>
        parseInt(m[1], 10)
      );
      const totalPages = pageNums.length > 0 ? Math.max(pageNum, ...pageNums) : Math.max(pageNum, 65);
      if (items.length > 0) {
        arenaDecksCache.set(cacheKey, { ts: Date.now(), totalPages, items });
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, page: pageNum, totalPages, items }));
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, page: pageNum, totalPages: 65, items: [] }));
    }
  }

  if (url.pathname === '/api/deck-ratings' && req.method === 'GET') {
    const authUser = getAuthUserFromRequest(req);
    const voterKey =
      authUser?.userId ||
      String(req.headers['x-voter-id'] || url.searchParams.get('voterId') || 'anon');
    const summary = summarizeDeckRatings(voterKey);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, ...summary }));
  }

  if (url.pathname === '/api/deck-ratings/rate' && req.method === 'POST') {
    if (isRateLimited(req, 'deck_rate', 40, 60 * 1000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'RATE_LIMITED' }));
    }
    try {
      const authUser = getAuthUserFromRequest(req);
      const parsed = await readPostBody(req);
      const deckId = String(parsed.deckId || '').trim().slice(0, 120);
      const rawRating = parseInt(parsed.rating, 10);
      const isUnrate = parsed.action === 'unrate' || rawRating === 0;
      const rating = Math.max(1, Math.min(5, rawRating || 5));
      if (!deckId) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'DECK_ID_REQUIRED' }));
      }
      const voterKey =
        authUser?.userId ||
        String(
          parsed.voterId ||
            req.headers['x-voter-id'] ||
            req.headers['x-forwarded-for'] ||
            req.socket?.remoteAddress ||
            'anon'
        );
      const store = { ...readStore('deck_ratings', DECK_RATINGS_FILE, {}) };
      const current = store[deckId] || { votes: {}, deck: null };
      const nextVotes = { ...(current.votes || {}) };
      if (isUnrate) {
        delete nextVotes[voterKey];
      } else {
        nextVotes[voterKey] = rating;
      }
      current.votes = nextVotes;
      if (parsed.deck && Array.isArray(parsed.deck.cards) && parsed.deck.cards.length === 8) {
        current.deck = {
          id: deckId,
          title: String(parsed.deck.title || 'Meta Deste').slice(0, 90),
          titleEn: String(parsed.deck.titleEn || parsed.deck.title || 'Meta Deck').slice(0, 90),
          winRate: parsed.deck.winRate || 55.0,
          avgElixir: parsed.deck.avgElixir || '3.5',
          matchesCount: parsed.deck.matchesCount || '5.2k',
          cards: parsed.deck.cards.slice(0, 8),
        };
      }
      current.updatedAt = new Date().toISOString();
      if (Object.keys(current.votes).length === 0) {
        delete store[deckId];
      } else {
        store[deckId] = current;
      }
      writeStore('deck_ratings', DECK_RATINGS_FILE, store);
      const summary = summarizeDeckRatings(voterKey);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          ok: true,
          deckId,
          rating: summary.summaries[deckId] || { avgRating: 0, voteCount: 0, userVote: 0 },
          ...summary,
        })
      );
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'BAD_REQUEST' }));
    }
  }

  if (url.pathname === '/api/arena-decks' && req.method === 'GET') {
    const arenaNum = Math.max(0, Math.min(32, parseInt(url.searchParams.get('arena') || '1', 10) || 0));
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const cacheKey = `arena-${arenaNum}-p${pageNum}`;
    const cached = arenaDecksCache.get(cacheKey);
    if (cached && cached.items?.length > 0 && Date.now() - cached.ts < 15 * 60 * 1000) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({ ok: true, arena: arenaNum, page: pageNum, totalPages: cached.totalPages, items: cached.items })
      );
    }
    try {
      const targetUrl =
        pageNum === 1
          ? `https://deckmelon.com/tr/best-decks/arena-${arenaNum}`
          : `https://deckmelon.com/tr/best-decks/arena-${arenaNum}/page-${pageNum}`;
      const pageRes = await fetchHttpsText(targetUrl);
      let items = pageRes.status === 200 ? parseDeckMelonPage(pageRes.html, arenaNum, 50) : [];
      if (items.length === 0 && pageNum === 1) {
        items = buildFallbackArenaDecks(arenaNum);
      } else if (arenaNum <= 2 && pageNum === 1 && items.length < 4) {
        items = [...items, ...buildFallbackArenaDecks(arenaNum)];
      }
      const pageNums = [...(pageRes.html || '').matchAll(/\/page-(\d+)/g)].map((m) =>
        parseInt(m[1], 10)
      );
      const totalPages = pageNums.length > 0 ? Math.max(pageNum, ...pageNums) : pageNum;
      if (items.length > 0) {
        arenaDecksCache.set(cacheKey, { ts: Date.now(), totalPages, items });
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, arena: arenaNum, page: pageNum, totalPages, items }));
    } catch (e) {
      const fallbackItems = pageNum === 1 ? buildFallbackArenaDecks(arenaNum) : [];
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, arena: arenaNum, page: pageNum, totalPages: pageNum, items: fallbackItems }));
    }
  }

  // 1.5) UZAKTAN YÖNETİLEBİLİR GÜNCEL HABERLER (/api/news)
  if (url.pathname === '/api/news' && req.method === 'GET') {
    const defaultNews = [
      {
        id: 'news-1',
        tag: '🚀 GELECEK GÜNCELLEME',
        tagEn: '🚀 UPCOMING UPDATE',
        tagColor: '#FFB800',
        publishedAt: '2026-11-22T14:30:00+03:00',
        date: '22 Kasım 2026, Pazar • 14:30',
        dateEn: 'Nov 22, 2026, Sunday • 14:30',
        title: 'Yeni Evrimler ve Kule Birliği Dengelemesi Geliyor!',
        titleEn: 'New Card Evolutions & Tower Troop Balances Incoming!',
        summary:
          'Önümüzdeki sezon güncellemesiyle birlikte 2 yeni Kart Evrimi (Evolution) ve Efsaneler Yolu kupa sıfırlaması aktif olacak. Evrim parçalarınızı (Wild Shards) yeni sezon öncesi biriktirmeniz önerilir.',
        summaryEn:
          'The upcoming seasonal update introduces 2 new Card Evolutions and a Path of Legends reset. Saving your Evolution Wild Shards before the new season drops is strongly recommended.',
        highlights: [
          '⚡ Yeni Evrim Slotları ve Şampiyon dengelemeleri test ediliyor.',
          '🎁 Kraliyet Turnuvası 10+ galibiyet bonus ödüllerinde Efsanevi Kral Sandığı fırsatı.',
          '🛡️ Düşük kullanılan bina kartlarına +%6 Can (HP) güçlendirmesi (Buff) bekleniyor.',
        ],
        highlightsEn: [
          '⚡ New Evolution slots and Champion balance tweaks are currently in testing.',
          '🎁 Global Tournament 10+ win bonus rewards feature Legendary King’s Chests.',
          '🛡️ Underused defensive buildings are expected to receive a +6% HP buff.',
        ],
      },
      {
        id: 'news-2',
        tag: '⚖️ DENGELEME (BUFF / NERF)',
        tagEn: '⚖️ BALANCE CHANGES',
        tagColor: '#38BDF8',
        publishedAt: '2026-11-20T18:15:00+03:00',
        date: '20 Kasım 2026, Cuma • 18:15',
        dateEn: 'Nov 20, 2026, Friday • 18:15',
        title: 'Meta Değişiyor: Güçlenen (Buff) ve Zayıflayan (Nerf) Kartlar',
        titleEn: 'Meta Shift: Top Buffed & Nerfed Cards Right Now',
        summary:
          'Son dengeleme paketi sonrasında Köprü Spam ve Evrimli P.E.K.K.A destelerinin kazanma oranı %61 üzerine çıkarken, ağır iksirli destelerde Yıldırım büyüsü öne geçti.',
        summaryEn:
          'Following recent balance adjustments, Bridge Spam and Evo P.E.K.K.A decks surged past a 61% win rate while Lightning dominates heavy Beatdown matchups.',
        highlights: [
          '📈 GÜÇLENENLER (BUFF): P.E.K.K.A Evrimi, Koçbaşı, Balıkçı, Bombacı Evrimi.',
          '📉 ZAYIFLAYANLAR (NERF): Aşırı savunma binaları ve üçlü küçük büyü döngüleri.',
          '💡 Tavsiye: 20. Arena ve üzerindeyseniz destenizde mutlaka 1 sıfırlama kartı (Çarpma / Elektro Büyücü) bulundurun.',
        ],
        highlightsEn: [
          '📈 WINNERS (BUFFED): Evo P.E.K.K.A, Battle Ram, Fisherman, Evo Bomber.',
          '📉 LOSERS (NERFED): Passive defensive buildings and triple small-spell cycles.',
          '💡 Pro Tip: At Arena 20+, always include at least one reset card (Zap / Electro Wizard) in your deck.',
        ],
      },
      {
        id: 'news-3',
        tag: '🏆 ETKİNLİK & TURNUVA',
        tagEn: '🏆 EVENTS & TOURNAMENTS',
        tagColor: '#D946EF',
        publishedAt: '2026-11-18T11:00:00+03:00',
        date: '18 Kasım 2026, Çarşamba • 11:00',
        dateEn: 'Nov 18, 2026, Wednesday • 11:00',
        title: 'Küresel Turnuva & İkili İksir Mücadelesi Başlıyor',
        titleEn: 'Global Tournament & Double Elixir Challenge Live',
        summary:
          'Supercell resmi turnuva takvimine göre bu hafta sonu Küresel Turnuva (Global Tournament) ve Özel Evrim Mücadelesi etkinlik sekmesinde açılıyor.',
        summaryEn:
          'According to the official tournament schedule, the Global Tournament and Special Evolution Challenge open this weekend in the Events tab.',
        highlights: [
          '👑 Küresel Turnuva hedefi: En az 10 galibiyet alarak 500 Taş değerindeki Bonus Ödül Kasasını açmak.',
          '🔥 Ücretsiz Etkinlik Mağazası (Season Shop) üzerinden 1 adet Evrim Parçası ve 3 adet Kart Kitabı almayı unutmayın!',
        ],
        highlightsEn: [
          '👑 Global Tournament goal: Hit 10+ wins to unlock maximum value on the 500-Gem Bonus Rewards.',
          '🔥 Remember to claim your monthly Wild Evolution Shard and Magic Books from the Season Shop!',
        ],
      },
    ];
    const items = readStore('remote_news', NEWS_FILE, defaultNews);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, items, updatedAt: new Date().toISOString() }));
  }

  // 2) CANLI KÜRESEL TURNUVA, YENİ EVRİMLER & GÜNCELLEME VERİLERİ (/api/events)
  if (url.pathname === '/api/events') {
    try {
      if (cachedEvents) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(cachedEvents));
      }

      const [tournamentsRes, cardsRes] = await Promise.all([
        fetchFromSupercell('/globaltournaments', customKey),
        cachedCards
          ? Promise.resolve({ status: 200, data: cachedCards })
          : fetchFromSupercell('/cards', customKey),
      ]);

      const allCards = cardsRes.data?.items || [];
      const evoCards = allCards
        .filter((c) => (c.maxEvolutionLevel || 0) > 0)
        .slice(-8)
        .reverse();
      const championCards = allCards.filter((c) => c.rarity === 'champion');

      const payload = {
        globalTournaments: tournamentsRes.data?.items || [],
        latestEvolutions: evoCards,
        champions: championCards,
        totalOfficialCards: allCards.length || 123,
      };
      if (allCards.length > 0) cachedEvents = payload;

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(payload));
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          globalTournaments: [],
          latestEvolutions: [],
          champions: [],
          totalOfficialCards: 123,
        })
      );
    }
  }

  // 3) GLOBAL VEYA TÜRKİYE LİDERLİK TABLOSU - İLK 100 OYUNCU (/api/leaderboard)
  if (url.pathname === '/api/leaderboard') {
    const region = url.searchParams.get('region') || 'global';
    try {
      if (region === 'TR') {
        if (cachedLeaderboardTR) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(cachedLeaderboardTR));
        }
        const trId = await getTurkeyLocationId(customKey);
        let trRes = await fetchFromSupercell(
          `/locations/${trId}/pathoflegend/players?limit=100`,
          customKey
        );
        if (!trRes.data?.items || trRes.data.items.length === 0) {
          trRes = await fetchFromSupercell(
            `/locations/${trId}/rankings/players?limit=100`,
            customKey
          );
        }
        if (trRes.status === 200 && trRes.data?.items && trRes.data.items.length > 0) {
          cachedLeaderboardTR = trRes.data;
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(trRes.data));
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(generateFallbackLeaderboard('TR')));
      }

      if (cachedLeaderboardGlobal) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(cachedLeaderboardGlobal));
      }
      const lbRes = await fetchFromSupercell(
        '/locations/global/pathoflegend/players?limit=100',
        customKey
      );
      if (lbRes.status === 200 && lbRes.data?.items && lbRes.data.items.length > 0) {
        cachedLeaderboardGlobal = lbRes.data;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(lbRes.data));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackLeaderboard('global')));
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackLeaderboard(region)));
    }
  }

  // 3.5) EN İYİ 100 KLAN SIRALAMASI (/api/clan-leaderboard?region=global|TR)
  if (url.pathname === '/api/clan-leaderboard') {
    const region = url.searchParams.get('region') || 'global';
    try {
      if (region === 'TR') {
        if (cachedClanLeaderboardTR) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(cachedClanLeaderboardTR));
        }
        const trId = await getTurkeyLocationId(customKey);
        const trRes = await fetchFromSupercell(
          `/locations/${trId}/rankings/clans?limit=100`,
          customKey
        );
        if (trRes.status === 200 && trRes.data?.items && trRes.data.items.length > 0) {
          cachedClanLeaderboardTR = trRes.data;
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(trRes.data));
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(generateFallbackClanLeaderboard('TR')));
      }

      if (cachedClanLeaderboardGlobal) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(cachedClanLeaderboardGlobal));
      }
      const lbRes = await fetchFromSupercell(
        '/locations/global/rankings/clans?limit=100',
        customKey
      );
      if (lbRes.status === 200 && lbRes.data?.items && lbRes.data.items.length > 0) {
        cachedClanLeaderboardGlobal = lbRes.data;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(lbRes.data));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackClanLeaderboard('global')));
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackClanLeaderboard(region)));
    }
  }

  // 4) İSME GÖRE KLAN ARAMA (/api/clans/search?name=...)
  if (url.pathname === '/api/clans/search') {
    const queryName = (url.searchParams.get('name') || '').trim();
    if (queryName.length < 3) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          error: 'SHORT_NAME',
          message: 'Enter at least 3 characters to search clans.',
        })
      );
    }
    try {
      const searchRes = await fetchFromSupercell(
        `/clans?name=${encodeURIComponent(queryName)}&limit=20`,
        customKey
      );
      if (searchRes.status === 200 && Array.isArray(searchRes.data?.items)) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(searchRes.data));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          items: [
            { tag: '#2Y8L9Q', name: `${queryName} Efsaneleri`, members: 50, clanScore: 84620, requiredTrophies: 7000, location: { name: 'Türkiye' } },
            { tag: '#8P9Q2V', name: `${queryName} Esports`, members: 48, clanScore: 79410, requiredTrophies: 6500, location: { name: 'Türkiye' } },
            { tag: '#9L4K7M', name: `${queryName} Akademi`, members: 45, clanScore: 71200, requiredTrophies: 5500, location: { name: 'Türkiye' } },
          ],
        })
      );
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ items: [] }));
    }
  }

  // 5) KLAN TÜM DETAYLARI & ÜYE LİSTESİ (/api/clan/:tag)
  if (url.pathname.startsWith('/api/clan/')) {
    const rawTag = decodeURIComponent(url.pathname.replace('/api/clan/', ''))
      .trim()
      .toUpperCase();
    const formattedTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
    const encodedTag = encodeURIComponent(formattedTag);

    try {
      const clanRes = await fetchFromSupercell(`/clans/${encodedTag}`, customKey);
      if (clanRes.status === 200 && clanRes.data?.name) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(clanRes.data));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackClan(formattedTag)));
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(generateFallbackClan(formattedTag)));
    }
  }

  // 6) OYUNCU TÜM DETAYLARI + SANDIK DÖNGÜSÜ + MAÇ GEÇMİŞİ (/api/player/:tag)
  if (url.pathname.startsWith('/api/player/')) {
    const rawTag = decodeURIComponent(url.pathname.replace('/api/player/', ''))
      .trim()
      .toUpperCase();
    const formattedTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
    const encodedTag = encodeURIComponent(formattedTag);

    try {
      const [profileRes, chestsRes, battlesRes] = await Promise.all([
        fetchFromSupercell(`/players/${encodedTag}`, customKey),
        fetchFromSupercell(`/players/${encodedTag}/upcomingchests`, customKey),
        fetchFromSupercell(`/players/${encodedTag}/battlelog`, customKey),
      ]);

      writeUserPrefs({ lastTag: formattedTag });

      res.writeHead(profileRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          profile: profileRes.data,
          upcomingChests: chestsRes.data?.items || [],
          recentBattles: Array.isArray(battlesRes.data)
            ? battlesRes.data.slice(0, 10)
            : [],
        })
      );
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'SERVER_ERROR', message: error.message }));
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(
    JSON.stringify({
      status: 'ok',
      connected: true,
      service: 'Royale HUB v8.0 Resmi Veri & Topluluk Sunucusu',
      privacyPolicy: '/privacy',
    })
  );
});

initCloudStore().then(() => {
  server.listen(PORT, () => {
    console.log(`🛡️ Royale HUB v8.0 Sunucusu (${CLOUD_STORE_ENABLED ? 'Bulut DB' : 'Yerel Depo'}) çalışıyor: http://localhost:${PORT}`);
  });
});
