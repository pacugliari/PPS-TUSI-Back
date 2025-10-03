# 📘 PPS-TUSI-Back

## 🚀 Descripción

Este proyecto es un **backend en Node.js** construido con **Express** y **Sequelize** para gestionar usuarios y autenticación mediante **JWT**.
Actualmente incluye un módulo de **auth** con registro y login de usuarios, y está preparado para escalar con nuevos modelos .

---

## 🛠️ Tecnologías usadas

- [Node.js](https://nodejs.org/) — entorno de ejecución.
- [Express](https://expressjs.com/) — framework web.
- [Sequelize](https://sequelize.org/) — ORM para MySQL.
- [MySQL](https://www.mysql.com/) — base de datos relacional.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — hashing de contraseñas.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — generación y validación de JWT.
- [dotenv](https://www.npmjs.com/package/dotenv) — manejo de variables de entorno.
- [nodemon](https://nodemon.io/) — reinicio automático en desarrollo.

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

- Tabla principal: `usuarios`
- Campos:

  - `id` (PK, autoincremental)
  - `email` (string, único, requerido)
  - `password` (string, hash con bcrypt)
  - `role` (enum: `user` | `admin`, default `user`)
  - `name` (string, requerido)
  - `createdAt` / `updatedAt`

---

## 🚦 Scripts disponibles

- `npm run dev` → arranca con nodemon (hot reload).
- `npm start` → arranca en modo producción.

---

total, no dupliquemos. Sumale **solo** esta sección al final del README, enfocada en _migraciones y seed_ (dejá intacta tu sección de instalación actual):

---

## ▶️ Migrations & Seed (sequelize-cli)

### 1) Preparación mínima del CLI

Asegurate de tener estos dos archivos:

**.sequelizerc**

```js
const path = require("path");
module.exports = {
  config: path.resolve("src/config", "config.js"),
  "models-path": path.resolve("src", "models"),
  "seeders-path": path.resolve("src", "seeders"),
  "migrations-path": path.resolve("src", "migrations"),
};
```

**config/config.js**

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
};
```

> Tip: las credenciales vienen de tu `.env.development` / `.env.production`.

### 2) Migration inicial (opcional, placeholder)

```bash
npx sequelize-cli migration:generate --name <<nombre-migracion>>
```

Editá el archivo generado en `src/migrations/*-<<nombre-migracion>>.js` con un no-op:

Estructura basica de migracion:

```js
"use strict";
module.exports = {
  async up() {
    /* no-op */
  },
  async down() {
    /* no-op */
  },
};
```

```js
// Ejemplo de migration (doc):
// Crea una tabla simple `Bancos` con timestamps.
// Para generar y correr:
//   npx sequelize-cli migration:generate --name create-bancos
//   npm run db:migrate

"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bancos", {
      idBanco: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Bancos");
  },
};
```

### 3) Correr migraciones

```bash
npm run db:migrate
# para deshacer la última:
# npm run db:migrate:undo
# para deshacer todas:
# npm run db:migrate:undo:all
```

### 4) Seed básico (datos de ejemplo)

```bash
npm run db:seed:basic
```

Inserta 10 filas en **Bancos, Roles, Zonas, Categorias, SubCategorias, Marcas, Caracteristicas** y crea usuarios:

- `admin@mail.com` → rol **Administrador** (idRol=1)
- `operario@mail.com` → rol **Operario** (idRol=2)
- `usuario@mail.com` → rol **Usuario** (idRol=3)

> Usa `ignoreDuplicates: true`. Si MySQL marca incompatibilidad de FK, asegurate que PK/FK tengan el mismo tipo (ej. `INTEGER.UNSIGNED`).

---
