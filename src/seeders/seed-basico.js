// scripts/seed.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { initDb } = require("../config/sequelize");

const {
  // base
  Banco,
  Rol,
  Zona,
  Categoria,
  SubCategoria,
  Marca,
  Caracteristica,
  Usuario,
  // nuevos
  Perfil,
  Direccion,
  Tarjeta,
  Cupon,
  PromocionBancaria,
} = require("../models");

(async () => {
  try {
    // 1) Inicializa conexión y sincroniza
    await initDb({ sync: "alter" }); // 'force' la primera vez en dev, luego 'alter' o false

    // 2) Insertar datos base --------------------------------------------------

    // Bancos
    await Banco.bulkCreate(
      [
        "Nacion",
        "Provincia",
        "Ciudad",
        "Patagonia",
        "Galicia",
        "Santander",
        "BBVA",
        "Macro",
        "HSBC",
        "ICBC",
      ].map((nombre, i) => ({ idBanco: i + 1, nombre })),
      { ignoreDuplicates: true }
    );

    // Roles
    await Rol.bulkCreate(
      [
        {
          idRol: 1,
          nombre: "Administrador",
          tipo: "administrador",
          permisos: ["*"],
        },
        {
          idRol: 2,
          nombre: "Operario",
          tipo: "operario",
          permisos: ["pedidos:read", "stock:update"],
        },
        {
          idRol: 3,
          nombre: "Usuario",
          tipo: "usuario",
          permisos: [],
        },
      ],
      { ignoreDuplicates: true }
    );

    // Zonas
    await Zona.bulkCreate(
      Array.from({ length: 10 }, (_, i) => ({
        idZona: i + 1,
        nombre: `Zona ${i + 1}`,
        costoEnvio: 300 + i * 25,
      })),
      { ignoreDuplicates: true }
    );

    // Categorías
    const categorias = [
      "Notebooks",
      "PCs",
      "Monitores",
      "Periféricos",
      "Audio",
      "Conectividad",
      "Almacenamiento",
      "Impresión",
      "Gaming",
      "Accesorios",
    ].map((nombre, i) => ({
      idCategoria: i + 1,
      nombre,
      descripcion: `Categoria ${nombre}`,
    }));
    await Categoria.bulkCreate(categorias, { ignoreDuplicates: true });

    // Subcategorías
    await SubCategoria.bulkCreate(
      Array.from({ length: 10 }, (_, i) => ({
        idSubCategoria: i + 1,
        idCategoria: (i % 10) + 1,
        nombre: `Subcat ${i + 1}`,
        descripcion: `Subcategoria ${i + 1}`,
      })),
      { ignoreDuplicates: true }
    );

    // Marcas
    await Marca.bulkCreate(
      [
        "Acer",
        "Asus",
        "Lenovo",
        "HP",
        "Dell",
        "Logitech",
        "MSI",
        "Gigabyte",
        "Kingston",
        "Samsung",
      ].map((nombre, i) => ({
        idMarca: i + 1,
        nombre,
        descripcion: `Marca ${nombre}`,
      })),
      { ignoreDuplicates: true }
    );

    // Características
    await Caracteristica.bulkCreate(
      [
        "Color",
        "Peso",
        "Dimensiones",
        "Capacidad",
        "Velocidad",
        "Material",
        "Garantía",
        "Potencia",
        "Compatibilidad",
        "Modelo",
      ].map((descripcion, i) => ({ idCaracteristica: i + 1, descripcion })),
      { ignoreDuplicates: true }
    );

    // Usuarios
    await Usuario.bulkCreate(
      [
        {
          idRol: 1, // Administrador
          compraOnline: false,
          email: "admin@mail.com",
          password: await bcrypt.hash("hashdemo123", 10),
        },
        {
          idRol: 2, // Operario
          compraOnline: false,
          email: "operario@mail.com",
          password: await bcrypt.hash("hashdemo123", 10),
        },
        {
          idRol: 3, // Usuario final
          compraOnline: false,
          email: "usuario@mail.com",
          password: await bcrypt.hash("hashdemo123", 10),
        },
      ],
      { ignoreDuplicates: true }
    );

    // 3) Datos vinculados al usuario final (id = 3) ---------------------------

    // Obtenemos el usuario final por email; si no está, usamos 3
    const user = await Usuario.findOne({ where: { email: "usuario@mail.com" } });
    const userId = user?.idUsuario ?? 3;

    // PERFIL 1:1
    await Perfil.findOrCreate({
      where: { idUsuario: userId },
      defaults: {
        idUsuario: userId,
        nombre: "Usuario Final",
        dni: 40123456,
        telefono: "+54 11 5555-1234",
      },
    });

    // DIRECCION (N:1 con Usuario y Zona)
    await Direccion.findOrCreate({
      where: { idUsuario: userId, direccion: "Av. Siempre Viva 742" },
      defaults: {
        idUsuario: userId,
        idZona: 1, // existe por seed de Zonas
        direccion: "Av. Siempre Viva 742",
        localidad: "Springfield",
        cp: "1000",
      },
    });

    // TARJETAS (N:1 con Usuario y Banco)
    await Tarjeta.findOrCreate({
      where: { idUsuario: userId, numero: "4111 1111 1111 1111" },
      defaults: {
        idUsuario: userId,
        idBanco: 5, // Galicia
        tipo: "VISA",
        codigo: "123",
        numero: "4111 1111 1111 1111",
      },
    });

    await Tarjeta.findOrCreate({
      where: { idUsuario: userId, numero: "5500 0000 0000 0004" },
      defaults: {
        idUsuario: userId,
        idBanco: 6, // Santander
        tipo: "MASTERCARD",
        codigo: "456",
        numero: "5500 0000 0000 0004",
      },
    });

    // CUPONES (N:1 con Usuario)
    const hoy = new Date();
    const en30 = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);

    await Cupon.findOrCreate({
      where: { codigo: "BIENVENIDA10" },
      defaults: {
        idUsuario: userId,
        monto: 10.0,
        codigo: "BIENVENIDA10",
        fechaDesde: hoy,
        fechaHasta: en30,
      },
    });

    await Cupon.findOrCreate({
      where: { codigo: "ENVIOGRATIS" },
      defaults: {
        idUsuario: userId,
        monto: 0.0,
        codigo: "ENVIOGRATIS",
        fechaDesde: hoy,
        fechaHasta: en30,
      },
    });

    // PROMOCIONES BANCARIAS (N:1 con Banco)
    await PromocionBancaria.bulkCreate(
      [
        {
          idBanco: 5, // Galicia
          nombre: "12 cuotas sin interés",
          fechaDesde: hoy,
          fechaHasta: en30,
          dias: ["viernes", "sabado", "domingo"],
        },
        {
          idBanco: 6, // Santander
          nombre: "15% off con Mastercard",
          fechaDesde: hoy,
          fechaHasta: en30,
          dias: ["lunes", "martes", "miercoles", "jueves"],
        },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Seed completo insertado (incluye usuario id=3 y datos relacionados).");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  }
})();
