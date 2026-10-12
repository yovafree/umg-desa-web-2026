// =====================================================================
//  owasp-demo — Código VULNERABLE vs. SEGURO (OWASP Top 10:2025)
//  Desarrollo Web · UMG Cobán
//
//  ⚠️  Esta app es INTENCIONALMENTE vulnerable en las rutas /vuln/*.
//      Ejecútala solo en tu máquina (localhost). Nunca la publiques.
// =====================================================================
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('node:path');

// ---------------------------------------------------------------------
// Base de datos en memoria
// ---------------------------------------------------------------------
const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY, correo TEXT UNIQUE, nombre TEXT, rol TEXT,
    clave_md5 TEXT,      -- ❌ A04: así NO se guardan contraseñas
    clave_bcrypt TEXT    -- ✅ A04: así sí
  );
  CREATE TABLE pedidos (id INTEGER PRIMARY KEY, usuario_id INTEGER, producto TEXT, total REAL);
  CREATE TABLE comentarios (id INTEGER PRIMARY KEY, autor TEXT, texto TEXT);
`);
const md5 = s => crypto.createHash('md5').update(s).digest('hex');
const usuarios = [
  [1, 'admin@umg.edu.gt', 'Administrador', 'admin', 'Adm1n#2026!'],
  [2, 'ana@umg.edu.gt', 'Ana López', 'cliente', 'ana12345'],
  [3, 'luis@umg.edu.gt', 'Luis Pérez', 'cliente', 'luis12345'],
];
const insU = db.prepare('INSERT INTO usuarios VALUES (?,?,?,?,?,?)');
for (const [id, correo, nombre, rol, clave] of usuarios) {
  insU.run(id, correo, nombre, rol, md5(clave), bcrypt.hashSync(clave, 10));
}
const insP = db.prepare('INSERT INTO pedidos VALUES (?,?,?,?)');
insP.run(1, 2, 'Laptop', 7500); insP.run(2, 2, 'Mouse', 150);
insP.run(3, 3, 'Monitor 27"', 2400); insP.run(4, 1, 'Servidor', 42000);

// Sesiones simples en memoria (token aleatorio → id de usuario)
const sesiones = new Map();
function crearSesion(usuarioId) {
  const token = crypto.randomBytes(32).toString('hex'); // ✅ A04: aleatorio criptográfico
  sesiones.set(token, usuarioId);
  return token;
}
function auth(req, res, next) {
  const id = sesiones.get(req.cookies.sid);
  if (!id) return res.status(401).json({ error: 'No autenticado' });
  req.user = db.prepare('SELECT id, correo, nombre, rol FROM usuarios WHERE id = ?').get(id);
  next();
}

// ---------------------------------------------------------------------
// Configuración de la app
// ---------------------------------------------------------------------
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ A02: helmet agrega CSP, X-Content-Type-Options, quita X-Powered-By, etc.
//    Se aplica SOLO a /seguro y a las páginas seguras para poder comparar.
const seguridad = helmet({
  contentSecurityPolicy: {
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], objectSrc: ["'none'"],
      upgradeInsecureRequests: null }, // en producción (HTTPS) se puede dejar activo
  },
});

app.use(['/seguro.html', '/seguro.js'], seguridad);
app.use('/', express.static(path.join(__dirname, 'public')));

// =====================================================================
//  RUTAS VULNERABLES  (/vuln/...)
// =====================================================================
const vuln = express.Router();

// ❌ A05 Inyección SQL — la consulta se arma concatenando texto
//    Ataque: correo = admin@umg.edu.gt'--   (clave: cualquier cosa)
vuln.post('/login', (req, res) => {
  const { correo = '', clave = '' } = req.body;
  const sql = `SELECT id, correo, nombre, rol FROM usuarios
               WHERE correo = '${correo}' AND clave_md5 = '${md5(clave)}'`;
  console.log('[vuln] SQL ejecutado:', sql.replace(/\s+/g, ' '));
  const u = db.prepare(sql).get();
  // ❌ A07: el mensaje revela si el correo existe
  if (!u) {
    const existe = db.prepare('SELECT 1 FROM usuarios WHERE correo = ?').get(correo);
    return res.status(401).json({ error: existe ? 'Contraseña incorrecta' : 'El correo no existe' });
  }
  res.cookie('sid', crearSesion(u.id)); // ❌ A07: cookie sin HttpOnly/Secure/SameSite
  res.json({ mensaje: `Bienvenido ${u.nombre}`, usuario: u, sql });
});

// ❌ A01 IDOR — cualquier usuario autenticado ve cualquier pedido
vuln.get('/pedidos/:id', auth, (req, res) => {
  const p = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  res.json(p ?? {});
});

// ❌ A01 Escalada de privilegios — el cliente decide su rol
vuln.post('/registro', (req, res) => {
  const { correo, nombre, clave, rol = 'cliente' } = req.body;
  const r = db.prepare('INSERT INTO usuarios (correo, nombre, rol, clave_md5) VALUES (?,?,?,?)')
    .run(correo, nombre, rol, md5(clave));
  res.json({ id: Number(r.lastInsertRowid), correo, rol });
});

// ❌ A05 XSS almacenado — se guarda tal cual y el front lo pinta con innerHTML
vuln.post('/comentarios', (req, res) => {
  db.prepare('INSERT INTO comentarios (autor, texto) VALUES (?,?)')
    .run(req.body.autor ?? 'anónimo', req.body.texto ?? '');
  res.json({ ok: true });
});
vuln.get('/comentarios', (req, res) => res.json(db.prepare('SELECT * FROM comentarios').all()));

// ❌ A04 Exposición de hashes débiles
vuln.get('/usuarios', (req, res) =>
  res.json(db.prepare('SELECT id, correo, rol, clave_md5 FROM usuarios').all()));

// ❌ A10 / A02 — falla abierto y devuelve el stack trace al cliente
vuln.get('/reporte', (req, res) => {
  try {
    const dias = JSON.parse(req.query.filtro).dias; // ?filtro=no-es-json
    res.json({ dias });
  } catch (err) {
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

app.use('/vuln', vuln);

// =====================================================================
//  RUTAS SEGURAS  (/seguro/...)
// =====================================================================
const seguro = express.Router();
seguro.use(seguridad);

// ✅ A07: límite de intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
});

// ✅ A05: consulta parametrizada  ✅ A04: bcrypt  ✅ A07: mensaje genérico
seguro.post('/login', loginLimiter, async (req, res) => {
  const { correo, clave } = req.body;
  if (typeof correo !== 'string' || typeof clave !== 'string' || correo.length > 254) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const u = db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo);
  const ok = u?.clave_bcrypt && await bcrypt.compare(clave, u.clave_bcrypt);
  if (!ok) {
    console.warn(JSON.stringify({ evento: 'login_fallido', correo, ip: req.ip, fecha: new Date().toISOString() })); // ✅ A09
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  res.cookie('sid', crearSesion(u.id), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 30 * 60 * 1000,
  });
  res.json({ mensaje: `Bienvenido ${u.nombre}`, usuario: { id: u.id, nombre: u.nombre, rol: u.rol } });
});

// ✅ A01: el pedido debe pertenecer al usuario autenticado (o ser admin)
seguro.get('/pedidos/:id', auth, (req, res) => {
  const p = req.user.rol === 'admin'
    ? db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id)
    : db.prepare('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?').get(req.params.id, req.user.id);
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  res.json(p);
});

// ✅ A01: el rol lo asigna el servidor, nunca el cliente
seguro.post('/registro', async (req, res) => {
  const { correo, nombre, clave } = req.body;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo ?? '') || (clave ?? '').length < 10) {
    return res.status(400).json({ error: 'Correo inválido o contraseña menor a 10 caracteres' });
  }
  try {
    const r = db.prepare('INSERT INTO usuarios (correo, nombre, rol, clave_bcrypt) VALUES (?,?,?,?)')
      .run(correo, nombre, 'cliente', await bcrypt.hash(clave, 12));
    res.status(201).json({ id: Number(r.lastInsertRowid), correo, rol: 'cliente' });
  } catch {
    res.status(400).json({ error: 'No se pudo registrar' });
  }
});

// ✅ A05: validación de longitud; el front usa textContent; CSP bloquea scripts inline
seguro.post('/comentarios', (req, res) => {
  const { autor = 'anónimo', texto = '' } = req.body;
  if (typeof texto !== 'string' || texto.length === 0 || texto.length > 500) {
    return res.status(400).json({ error: 'El comentario debe tener entre 1 y 500 caracteres' });
  }
  db.prepare('INSERT INTO comentarios (autor, texto) VALUES (?,?)').run(String(autor).slice(0, 50), texto);
  res.status(201).json({ ok: true });
});
seguro.get('/comentarios', (req, res) => res.json(db.prepare('SELECT * FROM comentarios').all()));

// ✅ A10: entrada inválida → 400 con mensaje genérico; detalle solo en el log
seguro.get('/reporte', (req, res) => {
  let filtro;
  try { filtro = JSON.parse(req.query.filtro ?? '{}'); }
  catch { return res.status(400).json({ error: 'Filtro inválido' }); }
  const dias = Number(filtro.dias);
  if (!Number.isInteger(dias) || dias < 1 || dias > 365) {
    return res.status(400).json({ error: 'dias debe ser un entero entre 1 y 365' });
  }
  res.json({ dias });
});

app.use('/seguro', seguro);

// ✅ A02/A10: manejador global — nunca expone el stack trace
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`owasp-demo en http://localhost:${PORT}`);
  console.log('  Vulnerable: http://localhost:%d/vuln.html', PORT);
  console.log('  Seguro:     http://localhost:%d/seguro.html', PORT);
});
