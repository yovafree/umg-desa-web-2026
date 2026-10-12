# owasp-demo — Código vulnerable vs. seguro (OWASP Top 10:2025)

App didáctica para la clase **OWASP y prácticas de seguridad** — Desarrollo Web, UMG Cobán.

> ⚠️ Las rutas `/vuln/*` son **intencionalmente vulnerables**. Ejecuta la app solo en tu máquina (escucha en `127.0.0.1`). Nunca la publiques en un servidor.

## Requisitos e instalación

- Node.js **22.13 o superior** (usa el módulo integrado `node:sqlite`, sin instalar base de datos)

```bash
npm install
npm start
```

- Vulnerable: http://localhost:3000/vuln.html
- Segura: http://localhost:3000/seguro.html

**Usuarios de prueba:** `ana@umg.edu.gt / ana12345` · `luis@umg.edu.gt / luis12345`
La base de datos vive en memoria: al reiniciar el servidor vuelve al estado inicial.

## Mapa de vulnerabilidades

| Categoría | Ruta vulnerable | Qué falla | Ruta segura | Qué la protege |
|---|---|---|---|---|
| A05 Inyección SQL | `POST /vuln/login` | SQL concatenado | `POST /seguro/login` | Consulta parametrizada |
| A04 Criptográficas | `GET /vuln/usuarios` | Contraseñas en MD5 | — | bcrypt con costo 10–12 |
| A07 Autenticación | `POST /vuln/login` | Revela si el correo existe, sin límite de intentos, cookie sin flags | `POST /seguro/login` | Mensaje genérico, 5 intentos / 15 min, cookie `HttpOnly` + `SameSite` |
| A01 Control de acceso (IDOR) | `GET /vuln/pedidos/:id` | No verifica dueño | `GET /seguro/pedidos/:id` | Filtra por `usuario_id` |
| A01 Escalada de privilegios | `POST /vuln/registro` | Acepta `rol` del cliente | `POST /seguro/registro` | Rol asignado por el servidor |
| A05 XSS almacenado | `vuln.js` + `/vuln/comentarios` | `innerHTML` | `seguro.js` + `/seguro/comentarios` | `textContent` + CSP + validación |
| A02 Configuración | páginas `vuln*` | Sin encabezados, `X-Powered-By` | páginas `seguro*` | `helmet` (CSP, nosniff…) |
| A10 Condiciones excepcionales | `GET /vuln/reporte` | Devuelve el stack trace | `GET /seguro/reporte` | 400 genérico + validación de rango |
| A09 Registro | — | — | `POST /seguro/login` | Log JSON de `login_fallido` sin la contraseña |

## Ejercicios guiados

### Ejercicio 1 — Inyección SQL (A05)
1. En `vuln.html`, inicia sesión con correo `admin@umg.edu.gt'--` y cualquier contraseña.
2. Observa en la respuesta (campo `sql`) y en la consola del servidor la consulta que se ejecutó. ¿Qué hizo el `--`?
3. Repite en `seguro.html`. ¿Por qué ahora falla?

### Ejercicio 2 — Enumeración de usuarios y fuerza bruta (A07)
1. En `vuln.html` intenta entrar con `noexiste@umg.edu.gt` y luego con `ana@umg.edu.gt` y una clave incorrecta. Compara los mensajes.
2. En `seguro.html` falla el login 6 veces seguidas. ¿Qué código HTTP recibes en el sexto intento?

### Ejercicio 3 — IDOR (A01)
1. Inicia sesión como Ana en cualquiera de las dos páginas.
2. Consulta los pedidos 1, 2, 3 y 4 en ambas versiones. ¿Cuáles pertenecen a Ana? ¿Cuáles deberías poder ver?

### Ejercicio 4 — Escalada de privilegios (A01)
```bash
curl -X POST localhost:3000/vuln/registro -H "Content-Type: application/json" \
  -d '{"correo":"hacker@x.com","nombre":"h","clave":"1234567890","rol":"admin"}'
```
Repite contra `/seguro/registro` y compara el `rol` devuelto.

### Ejercicio 5 — XSS (A05)
1. En `vuln.html` publica el comentario: `<img src=x onerror="alert('XSS: '+document.cookie)">`
2. Abre `seguro.html`: el mismo comentario se muestra como texto. Abre DevTools → Network y revisa el encabezado `Content-Security-Policy` de `seguro.html`.

### Ejercicio 6 — Manejo de errores (A10 / A02)
En ambas páginas genera el reporte con el filtro `esto-no-es-json` y luego con `{"dias": 9999}`. ¿Qué información le da cada versión a un atacante?

### Reto final
Corrige `GET /vuln/usuarios` para que no exponga ningún hash y solo lo pueda consultar un usuario con rol `admin`.

## Preguntas de reflexión
1. ¿Por qué validar en el navegador no es suficiente?
2. Si React escapa el contenido por defecto, ¿en qué casos puede haber XSS en una app React?
3. ¿Qué ventaja tiene responder `404` en lugar de `403` cuando un usuario pide un recurso ajeno?
