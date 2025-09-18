require("dotenv").config();
const { initDb } = require("../config/sequelize");
const bcrypt = require("bcryptjs");
const {
  Banco,
  Rol,
  Zona,
  Categoria,
  SubCategoria,
  Marca,
  Caracteristica,
  Usuario,
} = require("../models");

(async () => {
  try {
    // Inicializa conexión y sincroniza
    // Primera vez en dev podés usar 'force'. Luego dejá 'alter' o false.
    await initDb({ sync: "alter" });

    // 3) insertar datos ------------------------

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
        idCategoria: (i % 10) + 1, // FK válida
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
          idRol: 3, // Usuario
          compraOnline: false,
          email: "usuario@mail.com",
          password: await bcrypt.hash("hashdemo123", 10),
        },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Seed básico insertado");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  }
})();
