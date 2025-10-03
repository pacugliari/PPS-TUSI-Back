# Instrucciones Copilot para PPS-TUSI-Back

## Descripción del Proyecto
- **API Backend** construida con Node.js, Express y Sequelize (MySQL).
- Funcionalidades principales: autenticación de usuarios (JWT), registro de usuarios y estructura modular para fácil expansión.
- Sigue una clara separación de responsabilidades: controladores, servicios, repositorios, modelos, middlewares y rutas.

## Arquitectura y Patrones Clave
- **Punto de entrada:** `app.js` configura Express, middlewares y rutas.
- **Base de datos:**
  - Configurada en `src/config/sequelize.js` usando variables de entorno (ver archivos `.env.*`).
  - Los modelos están en `src/models/` y se registran en `src/models/index.js`.
  - Sequelize sincroniza los modelos automáticamente al iniciar (`sequelize.sync({ alter: true })`).
- **Autenticación:**
  - Basada en JWT, con lógica en `src/services/auth-jwt.js` y middleware en `src/middlewares/auth.js`.
  - Modelo de usuario: `src/models/user.js`.
- **Manejo de errores:**
  - Centralizado en `src/middlewares/http-error.js` y clase de error personalizada en `src/utils/http-error.js`.
- **Respuestas API:**
  - Estandarizadas usando helpers en `src/utils/api-response.js`.
- **Rutas:**
  - Definidas en `src/routes/`, por ejemplo, `auth.js` para endpoints de autenticación.
- **Lógica de negocio:**
  - Ubicada en `src/services/` (ej: `auth-jwt.js`).
  - Acceso a datos vía `src/repositories/` (ej: `actor.js`).

## Flujos de Trabajo para Desarrolladores
- **Instalar dependencias:** `npm install`
- **Ejecutar en desarrollo:** `npm run dev` (usa `nodemon`)
- **Ejecutar en producción:** `npm start`
- **Configurar entorno:** Copiar `.env.development` como plantilla y definir variables de DB y JWT.
- **Migraciones de base de datos:** Los modelos se sincronizan automáticamente al iniciar; no hay scripts de migración manuales.

## Convenciones del Proyecto
- Usar sintaxis ES6+ (módulos CommonJS).
- Agregar nuevos modelos en `src/models/` y registrarlos en `src/models/index.js`.
- Agregar nuevas rutas en `src/routes/` y montarlas en `app.js`.
- Usar `api-response.js` para respuestas API consistentes.
- Manejar errores con la clase de error personalizada y el middleware.

## Puntos de Integración
- **Cloudinary:** Configuración en `src/config/cloudinary.js` (si se usa para uploads).
- **JWT:** Helpers para firmar/verificar en `src/utils/jwt.mjs`.
- **Sequelize:** Todo acceso a la BD es vía modelos y repositorios.

## Ejemplo de Expansión
- Para agregar un nuevo recurso (ej: Actor):
  1. Crear el modelo en `src/models/actor.js`.
  2. Agregar el repositorio en `src/repositories/actor.js`.
  3. Crear el controlador, servicio y ruta según sea necesario.
  4. Registrar el modelo en `src/models/index.js` y la ruta en `app.js`.

**Importante:** El archivo `.env.development` (y cualquier archivo `.env.*`) **no debe subirse al repositorio**. Asegúrate de que esté listado en `.gitignore`.

Consulta `README.md` para más detalles y configuración de entorno.
