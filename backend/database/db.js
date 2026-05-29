const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const USE_PG = !!process.env.DATABASE_URL;

// ══════════════════════════════════════════════════════════════════════════════
//  POSTGRESQL (Neon) mode
// ══════════════════════════════════════════════════════════════════════════════
let pool;
if (USE_PG) {
    const { Pool } = require('pg');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
}

function toPos(sql) {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
}

async function pgQuery(sql, params = []) {
    const { rows } = await pool.query(toPos(sql), params);
    return rows;
}

async function pgQueryOne(sql, params = []) {
    const { rows } = await pool.query(toPos(sql), params);
    return rows[0] || null;
}

async function pgExecute(sql, params = []) {
    const isInsert = /^\s*INSERT/i.test(sql);
    const q = isInsert ? toPos(sql) + ' RETURNING id' : toPos(sql);
    const result = await pool.query(q, params);
    return { lastId: result.rows[0]?.id || null, changes: result.rowCount || 0 };
}

async function pgInitDB() {
    const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL,
        user_type VARCHAR(20) DEFAULT 'student', is_active INT DEFAULT 1,
        last_login TIMESTAMP, created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, icon VARCHAR(50),
        parent_id INT REFERENCES menu_items(id), display_order INT DEFAULT 0,
        answer_text TEXT, created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, description TEXT,
        date VARCHAR(20) NOT NULL, location VARCHAR(200), category VARCHAR(50),
        is_active INT DEFAULT 1, created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS student_queries (
        id SERIAL PRIMARY KEY, student_name VARCHAR(100), student_email VARCHAR(255),
        query_text TEXT, menu_path VARCHAR(500), is_resolved INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255),
        subject VARCHAR(200), message TEXT, created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS chat_logs (
        id SERIAL PRIMARY KEY, session_id VARCHAR(100), user_message TEXT,
        bot_response TEXT, created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY, title VARCHAR(200), body TEXT, category VARCHAR(50),
        is_active INT DEFAULT 1, created_at TIMESTAMP DEFAULT NOW()
    );`;
    await pool.query(schema);

    // Seed admin
    const admin = await pgQueryOne('SELECT id FROM users WHERE email = ?', ['admin@uaf.edu.pk']);
    if (!admin) {
        const hashed = await bcrypt.hash('admin123', 10);
        await pgExecute(
            'INSERT INTO users (full_name, email, password, user_type, is_active) VALUES (?, ?, ?, ?, ?)',
            ['UAF Administrator', 'admin@uaf.edu.pk', hashed, 'admin', 1]
        );
    }

    // Seed menu items
    const menuCount = await pgQueryOne('SELECT COUNT(*) as c FROM menu_items', []);
    if (parseInt(menuCount?.c || 0) === 0) {
        await seedMenu(pgExecute);
    }

    // Seed events
    const evCount = await pgQueryOne('SELECT COUNT(*) as c FROM events', []);
    if (parseInt(evCount?.c || 0) === 0) {
        await seedEvents(pgExecute);
    }

    // Seed announcements
    const annCount = await pgQueryOne('SELECT COUNT(*) as c FROM announcements', []);
    if (parseInt(annCount?.c || 0) === 0) {
        await seedAnnouncements(pgExecute);
    }

    console.log('[DB] Neon PostgreSQL initialized');
}

// ══════════════════════════════════════════════════════════════════════════════
//  JSON FILE mode (local dev)
// ══════════════════════════════════════════════════════════════════════════════
const DB_FILE = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH.replace('.db', '.json'))
    : path.join(__dirname, 'uaf.json');
let store = {};

function loadStore() {
    if (fs.existsSync(DB_FILE)) {
        try { store = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (_) { store = {}; }
    }
    if (!store._seq) store._seq = {};
}

function saveStore() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function ensureTable(name) {
    if (!store[name]) store[name] = [];
    if (!store._seq[name]) store._seq[name] = 0;
}

function execSQL(sql, params) {
    const s = sql.replace(/\s+/g, ' ').trim();
    const u = s.toUpperCase();
    if (u.startsWith('SELECT')) return runSelect(s, params);
    if (u.startsWith('INSERT')) return runInsert(s, params);
    if (u.startsWith('UPDATE')) return runUpdate(s, params);
    if (u.startsWith('DELETE')) return runDelete(s, params);
    return { rows: [], lastInsertRowid: null };
}

function runSelect(sql, params) {
    const fromM = sql.match(/FROM\s+(\w+)/i);
    if (!fromM) return { rows: [] };
    const table = fromM[1].toLowerCase();
    ensureTable(table);
    let rows = [...store[table]];

    const whereM = sql.match(/WHERE\s+(.*?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereM) rows = applyWhere(rows, whereM[1].trim(), params);

    const orderM = sql.match(/ORDER\s+BY\s+(\w+)\s*(DESC|ASC)?/i);
    if (orderM) {
        const col = orderM[1].toLowerCase(), desc = (orderM[2] || '').toUpperCase() === 'DESC';
        rows.sort((a, b) => { if (a[col] < b[col]) return desc ? 1 : -1; if (a[col] > b[col]) return desc ? -1 : 1; return 0; });
    }

    const limitM = sql.match(/LIMIT\s+(\d+)/i);
    if (limitM) rows = rows.slice(0, parseInt(limitM[1]));

    const colM = sql.match(/^SELECT\s+(.*?)\s+FROM/i);
    const colStr = colM ? colM[1].trim() : '*';
    if (colStr === '*') return { rows };

    const countM = colStr.match(/COUNT\(\*\)\s+as\s+(\w+)/i);
    if (countM) return { rows: [{ [countM[1]]: rows.length }] };

    const cols = colStr.split(',').map(c => c.trim().toLowerCase());
    return { rows: rows.map(r => { const o = {}; cols.forEach(c => { if (c in r) o[c] = r[c]; }); return o; }) };
}

function applyWhere(rows, whereStr, params) {
    let paramIdx = 0;
    const conditions = [];
    whereStr.split(/\s+AND\s+/i).forEach(part => {
        part = part.trim();
        const eqQ = part.match(/^(\w+)\s*=\s*\?$/i);
        if (eqQ) { conditions.push({ col: eqQ[1].toLowerCase(), op: '=', value: params[paramIdx++] }); return; }
        const eqLit = part.match(/^(\w+)\s*=\s*(\d+)$/i);
        if (eqLit) { conditions.push({ col: eqLit[1].toLowerCase(), op: '=', value: parseInt(eqLit[2]) }); return; }
        const isNull = part.match(/^(\w+)\s+IS\s+NULL$/i);
        if (isNull) { conditions.push({ col: isNull[1].toLowerCase(), op: 'IS NULL' }); return; }
        const isNotNull = part.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
        if (isNotNull) { conditions.push({ col: isNotNull[1].toLowerCase(), op: 'IS NOT NULL' }); }
    });
    return rows.filter(row => conditions.every(c => {
        if (c.op === 'IS NULL') return row[c.col] == null;
        if (c.op === 'IS NOT NULL') return row[c.col] != null;
        return String(row[c.col]) === String(c.value);
    }));
}

function runInsert(sql, params) {
    const tableM = sql.match(/INTO\s+(\w+)\s*\(/i);
    if (!tableM) return { lastInsertRowid: null };
    const table = tableM[1].toLowerCase();
    ensureTable(table);
    const colsM = sql.match(/\(([^)]+)\)\s+VALUES/i);
    if (!colsM) return { lastInsertRowid: null };
    const cols = colsM[1].split(',').map(c => c.trim().toLowerCase());
    store._seq[table]++;
    const id = store._seq[table];
    const row = { id };
    cols.forEach((col, i) => { row[col] = params[i] !== undefined ? params[i] : null; });
    row.created_at = new Date().toISOString();
    store[table].push(row);
    saveStore();
    return { lastInsertRowid: id };
}

function runUpdate(sql, params) {
    const tableM = sql.match(/UPDATE\s+(\w+)\s+SET/i);
    if (!tableM) return { changes: 0 };
    const table = tableM[1].toLowerCase();
    ensureTable(table);
    const setM  = sql.match(/SET\s+(.*?)\s+WHERE/i);
    const whereM = sql.match(/WHERE\s+(.*?)$/i);
    const sets = setM ? setM[1].split(',').map(s => { const p = s.trim().split(/\s*=\s*/); return { col: p[0].trim().toLowerCase(), raw: p.slice(1).join('=').trim() }; }) : [];
    let paramIdx = 0;
    const setClauses = sets.map(s => ({ col: s.col, isParam: s.raw === '?', isCurrent: /CURRENT_TIMESTAMP/i.test(s.raw), litValue: (s.raw !== '?' && !/CURRENT_TIMESTAMP/i.test(s.raw)) ? s.raw : undefined }));
    const setParams = setClauses.filter(s => s.isParam).map(() => params[paramIdx++]);
    const whereConditions = [];
    if (whereM) {
        whereM[1].trim().split(/\s+AND\s+/i).forEach(part => {
            const m = part.trim().match(/^(\w+)\s*=\s*\?$/i);
            if (m) whereConditions.push({ col: m[1].toLowerCase(), value: params[paramIdx++] });
        });
    }
    let changes = 0, spIdx = 0;
    store[table] = store[table].map(row => {
        if (!whereConditions.every(c => String(row[c.col]) === String(c.value))) return row;
        changes++;
        const updated = { ...row };
        setClauses.forEach(s => {
            if (s.isParam) updated[s.col] = setParams[spIdx++] ?? null;
            else if (s.isCurrent) updated[s.col] = new Date().toISOString();
            else if (s.litValue !== undefined) updated[s.col] = isNaN(s.litValue) ? s.litValue : Number(s.litValue);
        });
        return updated;
    });
    saveStore();
    return { changes };
}

function runDelete(sql, params) {
    const tableM = sql.match(/FROM\s+(\w+)/i);
    if (!tableM) return { changes: 0 };
    const table = tableM[1].toLowerCase();
    ensureTable(table);
    const whereM = sql.match(/WHERE\s+(.*?)$/i);
    let paramIdx = 0;
    const conditions = [];
    if (whereM) {
        whereM[1].trim().split(/\s+AND\s+/i).forEach(part => {
            const m = part.trim().match(/^(\w+)\s*=\s*\?$/i);
            if (m) conditions.push({ col: m[1].toLowerCase(), value: params[paramIdx++] });
        });
    }
    const before = store[table].length;
    store[table] = store[table].filter(row => !conditions.every(c => String(row[c.col]) === String(c.value)));
    saveStore();
    return { changes: before - store[table].length };
}

function jsonGetDB() {
    return {
        query:    async (sql, params = []) => (execSQL(sql, params).rows || []),
        queryOne: async (sql, params = []) => (execSQL(sql, params).rows || [])[0] || null,
        execute:  async (sql, params = []) => {
            const r = execSQL(sql, params);
            return { lastId: r.lastInsertRowid || null, changes: r.changes || 0 };
        },
    };
}

async function jsonInitDB() {
    loadStore();
    ['users','contacts','chat_logs','announcements','menu_items','events','student_queries'].forEach(ensureTable);

    if (!store.users.find(u => u.email === 'admin@uaf.edu.pk')) {
        const hashed = bcrypt.hashSync('admin123', 10);
        store._seq.users++;
        store.users.push({ id: store._seq.users, full_name: 'UAF Administrator', email: 'admin@uaf.edu.pk', password: hashed, user_type: 'admin', is_active: 1, created_at: new Date().toISOString() });
        saveStore();
    }

    const db = jsonGetDB();
    if (store.menu_items.length === 0)    await seedMenu(db.execute.bind(db));
    if (store.events.length === 0)        await seedEvents(db.execute.bind(db));
    if (store.announcements.length === 0) await seedAnnouncements(db.execute.bind(db));
    console.log('[DB] JSON database initialized at', DB_FILE);
}

// ══════════════════════════════════════════════════════════════════════════════
//  Shared seed helpers
// ══════════════════════════════════════════════════════════════════════════════
async function seedMenu(exec) {
    const main = [
        ['Campus Locations','🏛️',1], ['Admissions & Fee','🎓',2],
        ['Hostels & Living','🏠',3],  ['Academic Info','📚',4],
        ['Transport & WiFi','🚌',5],  ['Events & News','📅',6],
    ];
    const ids = {};
    for (const [title, icon, order] of main) {
        const { lastId } = await exec('INSERT INTO menu_items (title, icon, parent_id, display_order, answer_text) VALUES (?, ?, ?, ?, ?)', [title, icon, null, order, null]);
        ids[title] = lastId;
    }
    const subs = [
        [ids['Campus Locations'],'VC Office','👔',1,'📍 Vice Chancellor\'s Office is on the 3rd Floor, Admin Block, Room 301. Hours: 9am–5pm Mon–Fri. Contact: Ext. 2001.'],
        [ids['Campus Locations'],'Admin Block','🏢',2,'🏛️ Admin Block is near the Main Gate. Houses VC Office, Registrar, Treasurer. Hours: 8:30am–4:30pm.'],
        [ids['Campus Locations'],'Central Library','📚',3,'📚 Central Library, Main Academic Block. Open 8am–12am (24/7 during exams). 200,000+ books, e-journals, WiFi. Ext. 3301.'],
        [ids['Campus Locations'],'Cafeterias','☕',4,'☕ Campus Cafeterias:\n• Main Cafeteria (Student Center) – 7am–11pm\n• Faculty Café (Admin Block) – 8am–6pm\n• Engineering & Agriculture Cafés\n• Hostel Mess – home-style meals'],
        [ids['Campus Locations'],'Medical Centre','🏥',5,'🏥 UAF Health Centre near Hostels. 24/7 emergency, OPD, pharmacy, ambulance. Emergency: 041-9200161 Ext. 7100.'],
        [ids['Campus Locations'],'Sports Complex','⚽',6,'⚽ Sports Complex, East Campus. Cricket, football, tennis, swimming pool, gym. Open 6am–10pm. Free for students.'],
        [ids['Admissions & Fee'],'BSc Admission','📋',1,'🎓 BSc Admissions open July–August. Requirements: 50%+ in intermediate, entry test. Apply at admissions.uaf.edu.pk. Last date: Aug 31.'],
        [ids['Admissions & Fee'],'MSc / PhD','🔬',2,'🔬 MSc/PhD Admissions twice a year. Requirements: relevant degree, GAT/GRE. Check uaf.edu.pk for schedule.'],
        [ids['Admissions & Fee'],'Fee Structure','💰',3,'💰 Fee Structure:\n• BSc: PKR 45,000–55,000/semester\n• MSc: PKR 50,000–65,000/semester\n• PhD: PKR 60,000–80,000/semester'],
        [ids['Admissions & Fee'],'Scholarships','🏆',4,'🏆 UAF Scholarships:\n• Need-based financial aid\n• Merit scholarships (top 10%)\n• HEC & PM Youth Program scholarships\nContact Treasurer: Ext. 2100.'],
        [ids['Hostels & Living'],'Boys Hostel','🏠',1,'🏠 Boys Hostels: West Campus. 7 blocks, 2,000+ students. Mess, study area, sports, 24/7 security. Contact: Ext. 7001.'],
        [ids['Hostels & Living'],'Girls Hostel','🏡',2,'🏡 Girls Hostels: North Campus. 3 blocks, 1,000+ students. Secure environment, mess, WiFi. Contact: Ext. 7002.'],
        [ids['Academic Info'],'Departments','🎓',1,'🎓 UAF has 6 faculties:\n• Faculty of Agriculture\n• Faculty of Agri Engineering & Technology\n• Faculty of Sciences\n• Faculty of Social Sciences\n• Faculty of Veterinary Science\n• Faculty of Animal Husbandry'],
        [ids['Academic Info'],'Exam & Results','📊',2,'📊 Results published on uaf.edu.pk under Examinations. For queries: Controller of Examinations, Ext. 2300.'],
        [ids['Academic Info'],'Registrar','📋',3,'📋 Registrar Office, Admin Block. Services: enrollment, transcripts, degrees, migration. Hours: 8:30am–4pm. Ext. 2200.'],
        [ids['Transport & WiFi'],'Bus Service','🚌',1,'🚌 University buses on 8 routes across Faisalabad. Monthly pass: PKR 1,500. Contact Transport Office: Ext. 8001.'],
        [ids['Transport & WiFi'],'WiFi / Internet','📶',2,'📶 Free WiFi across campus via PERN. Connect to "UAF_Student". Speed: 1 Gbps backbone.'],
        [ids['Transport & WiFi'],'Parking & Bank','🚗',3,'🚗 Parking near Main Gate (motorbike free, car PKR 500/month).\n🏦 Allied Bank ATM near Main Gate. Also HBL, MCB, National Bank ATMs on campus.'],
    ];
    for (const [pid, title, icon, order, answer] of subs) {
        await exec('INSERT INTO menu_items (title, icon, parent_id, display_order, answer_text) VALUES (?, ?, ?, ?, ?)', [title, icon, pid, order, answer]);
    }
}

async function seedEvents(exec) {
    const events = [
        ['Annual Agriculture Exhibition 2026','The 63rd Annual Agriculture Exhibition showcasing research and agri-products.','2026-03-15','Exhibition Centre, East Campus','Academic'],
        ['Fall 2026 Admissions Open','Applications for BSc, MSc and PhD for Fall 2026 now open. Last date: Aug 31.','2026-06-01','Registrar Office','Academic'],
        ['UAF Sports Gala 2026','Inter-department Sports Gala. Cricket, football, badminton and athletics.','2026-04-10','Sports Complex','Sports'],
        ['International Research Symposium','Climate-Smart Agriculture Symposium. Speakers from 15 countries.','2026-05-20','Conference Hall','Research'],
        ['Convocation Ceremony 2026','Annual Convocation for batch 2022–2026. Dress code: formal.','2026-07-15','Main Auditorium','Ceremony'],
        ['Agriculture Tech Fest','Tech festival: robotics, drones, AI in farming. Open to all students.','2026-10-05','Exhibition Centre','Workshop'],
    ];
    for (const [title, description, date, location, category] of events) {
        await exec('INSERT INTO events (title, description, date, location, category, is_active) VALUES (?, ?, ?, ?, ?, ?)', [title, description, date, location, category, 1]);
    }
}

async function seedAnnouncements(exec) {
    const items = [
        ['Fall 2026 Admissions Now Open', 'Applications for BSc, MSc and PhD programs for Fall 2026 are now open. Last date to apply: August 31, 2026. Visit uaf.edu.pk/admissions for details.', 'admissions'],
        ['International Research Symposium – May 20, 2026', 'Climate-Smart Agriculture Symposium featuring speakers from 15 countries. Open to all students and faculty. Registration at the Postgraduate Office.', 'research'],
        ['HEC Scholarship Applications Invited', 'HEC Need-Based Scholarships and Merit Scholarships for 2026–27 are open. Apply through the Treasurer Office (Ext. 2100) before June 30.', 'general'],
        ['UAF Ranked Among Top Agricultural Universities in Pakistan', 'The University of Agriculture Faisalabad has been ranked 1st in Pakistan for agricultural sciences by HEC for the year 2026.', 'general'],
    ];
    for (const [title, body, category] of items) {
        await exec('INSERT INTO announcements (title, body, category, is_active) VALUES (?, ?, ?, ?)', [title, body, category, 1]);
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  Public API
// ══════════════════════════════════════════════════════════════════════════════
let _inited = false;

async function initDB() {
    if (_inited) return;
    _inited = true;
    if (USE_PG) await pgInitDB();
    else        await jsonInitDB();
}

function getDB() {
    if (USE_PG) return { query: pgQuery, queryOne: pgQueryOne, execute: pgExecute };
    return jsonGetDB();
}

module.exports = { initDB, getDB };
