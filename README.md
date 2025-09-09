# 📘 PPS-TUSI-Back

## 🚀 Descripción

Este proyecto es un **backend en Node.js** construido con **Express** y **Sequelize** para gestionar usuarios y autenticación mediante **JWT**.
Actualmente incluye un módulo de **auth** con registro y login de usuarios, y está preparado para escalar con nuevos modelos .

---

## 🛠️ Tecnologías usadas

* [Node.js](https://nodejs.org/) — entorno de ejecución.
* [Express](https://expressjs.com/) — framework web.
* [Sequelize](https://sequelize.org/) — ORM para MySQL.
* [MySQL](https://www.mysql.com/) — base de datos relacional.
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) — hashing de contraseñas.
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — generación y validación de JWT.
* [dotenv](https://www.npmjs.com/package/dotenv) — manejo de variables de entorno.
* [nodemon](https://nodemon.io/) — reinicio automático en desarrollo.

---

## 📂 Estructura del proyecto

```bash
PPS-TUSI-Back/
├── app.js                  # Punto de entrada principal
├── /config
│   └── sequelize.js        # Configuración de Sequelize y conexión a DB
├── /src
│   ├── /controllers
│   │   └── auth.js     # Controladores de autenticación
│   ├── /middlewares
│   │   ├── http-error.js   # Middleware de manejo de errores
│   │   └── auth.js         # Middleware de validación JWT
│   ├── /models
│   │   ├── index.js        # Registro de modelos y asociaciones
│   │   └── user.js         # Modelo de usuarios
│   ├── /routes
│   │   └── auth.js     # Rutas de autenticación
│   ├── /services
│   │   └── auth-jwt.js     # Lógica de negocio para auth
│   └── /utils
│       ├── api-response.js # Formato estándar de respuestas
│       ├── http-error.js   # Clase de error personalizada
│       └── jwt.mjs         # Helpers para firmar/verificar JWT
└── package.json
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/pps-tusi-back.git
cd pps-tusi-back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivos `.env.development`, `.env.production`, etc.
Ejemplo (`.env.development`):

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=pps_tusi

JWT_SECRET=supersecreto
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Ejecutar en producción

```bash
npm start
```

---

## 🧑‍💻 Endpoints principales

### Registro

`POST /api/auth/register`

Body:

```json
{
  "email": "user@mail.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "name": "Juan Perez"
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

### Login

`POST /api/auth/login`

Body:

```json
{
  "email": "user@mail.com",
  "password": "Password123"
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Usuario autenticado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "email": "user@mail.com",
      "role": "user",
      "name": "Juan Perez"
    }
  }
}
```

---

## 🗄️ Base de datos

* Tabla principal: `usuarios`
* Campos:

  * `id` (PK, autoincremental)
  * `email` (string, único, requerido)
  * `password` (string, hash con bcrypt)
  * `role` (enum: `user` | `admin`, default `user`)
  * `name` (string, requerido)
  * `createdAt` / `updatedAt`

---

## 🚦 Scripts disponibles

* `npm run dev` → arranca con nodemon (hot reload).
* `npm start` → arranca en modo producción.

---

## ✅ TODO / Próximos pasos

* [ ] Agregar migraciones con `sequelize-cli`.
* [ ] Documentación con Swagger/OpenAPI.
* [ ] Roles y permisos avanzados.

---
