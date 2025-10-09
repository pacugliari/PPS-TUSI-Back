// scripts/seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDb } = require('../config/sequelize');

const {
  // base
  Banco, Rol, Zona, Categoria, SubCategoria, Marca, Caracteristica, Usuario, Direccion,
  // previos
  Perfil, Tarjeta, Cupon, PromocionBancaria,
  // catálogo / ventas / compras
  Producto, Stock, Propiedad, Comentario,
  Pedido, DetallePedido, Envio,
  OrdenCompra, ItemOrdenCompra,
  Devolucion,
} = require('../models');

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

(async () => {
  try {
    await initDb({ sync: 'alter' });

    /* =========================
     *  BASE
     * ========================= */
    await Banco.bulkCreate(
      ['Nacion', 'Provincia', 'Ciudad', 'Patagonia', 'Galicia', 'Santander', 'BBVA', 'Macro', 'HSBC', 'ICBC']
        .map((nombre, i) => ({ idBanco: i + 1, nombre })),
      { ignoreDuplicates: true }
    );

    await Rol.bulkCreate([
      { idRol: 1, nombre: 'Administrador', tipo: 'administrador', permisos: ['*'] },
      { idRol: 2, nombre: 'Operario', tipo: 'operario', permisos: ['pedidos:read', 'stock:update'] },
      { idRol: 3, nombre: 'Usuario', tipo: 'usuario', permisos: [] },
    ], { ignoreDuplicates: true });

    await Zona.bulkCreate(
      Array.from({ length: 10 }, (_, i) => ({ idZona: i + 1, nombre: `Zona ${i + 1}`, costoEnvio: 300 + i * 25 })),
      { ignoreDuplicates: true }
    );

    const categorias = ['Notebooks', 'PCs', 'Monitores', 'Periféricos', 'Audio', 'Conectividad', 'Almacenamiento', 'Impresión', 'Gaming', 'Accesorios']
      .map((nombre, i) => ({ idCategoria: i + 1, nombre, descripcion: `Categoria ${nombre}` }));
    await Categoria.bulkCreate(categorias, { ignoreDuplicates: true });

    await SubCategoria.bulkCreate(
      Array.from({ length: 10 }, (_, i) => ({ idSubCategoria: i + 1, idCategoria: (i % 10) + 1, nombre: `Subcat ${i + 1}`, descripcion: `Subcategoria ${i + 1}` })),
      { ignoreDuplicates: true }
    );

    await Marca.bulkCreate(
      ['Acer', 'Asus', 'Lenovo', 'HP', 'Dell', 'Logitech', 'MSI', 'Gigabyte', 'Kingston', 'Samsung']
        .map((nombre, i) => ({ idMarca: i + 1, nombre, descripcion: `Marca ${nombre}` })),
      { ignoreDuplicates: true }
    );

    await Caracteristica.bulkCreate(
      ['Color', 'Peso', 'Dimensiones', 'Capacidad', 'Velocidad', 'Material', 'Garantía', 'Potencia', 'Compatibilidad', 'Modelo']
        .map((descripcion, i) => ({ idCaracteristica: i + 1, descripcion })),
      { ignoreDuplicates: true }
    );

    await Usuario.bulkCreate([
      { idUsuario: 1, idRol: 1, compraOnline: false, email: 'admin@mail.com', password: await bcrypt.hash('hashdemo123', 10) },
      { idUsuario: 2, idRol: 2, compraOnline: false, email: 'operario@mail.com', password: await bcrypt.hash('hashdemo123', 10) },
      { idUsuario: 3, idRol: 3, compraOnline: false, email: 'usuario@mail.com', password: await bcrypt.hash('hashdemo123', 10) },
    ], { ignoreDuplicates: true });

    const user3 = await Usuario.findOne({ where: { email: 'usuario@mail.com' } });
    const userId = user3?.idUsuario ?? 3;

    await Perfil.bulkCreate([{
      idPerfil: 1,
      idUsuario: userId,
      nombre: 'Usuario Final',
      tipoDocumento: 'DNI',
      dni: 40123456,
      telefono: '+54 11 5555-1234',
    }], { ignoreDuplicates: true });

    const direcciones = [{
      idDireccion: 1,
      idUsuario: userId,
      idZona: 1,
      direccion: 'Av. Siempre Viva 742',
      localidad: 'Springfield',
      cp: '1000',
    }];
    await Direccion.bulkCreate(direcciones, { ignoreDuplicates: true });
    const dirUser = direcciones[0];

    await Tarjeta.bulkCreate([
      { idTarjeta: 1, idUsuario: userId, idBanco: 5, tipo: 'VISA', codigo: '123', numero: '4111 1111 1111 1111' },
      { idTarjeta: 2, idUsuario: userId, idBanco: 6, tipo: 'MASTERCARD', codigo: '456', numero: '5500 0000 0000 0004' },
    ], { ignoreDuplicates: true });

    const hoy = new Date();
    const en30 = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);

    await Cupon.bulkCreate([
      { idCupon: 1, idUsuario: userId, monto: 10, codigo: 'BIENVENIDA10', fechaDesde: hoy, fechaHasta: en30 },
      { idCupon: 2, idUsuario: userId, monto: 0, codigo: 'ENVIOGRATIS', fechaDesde: hoy, fechaHasta: en30 },
    ], { ignoreDuplicates: true });

    await PromocionBancaria.bulkCreate([
      { idPromocionBancaria: 1, idBanco: 5, nombre: '12 cuotas sin interés', fechaDesde: hoy, fechaHasta: en30, dias: ['viernes', 'sabado', 'domingo'] },
      { idPromocionBancaria: 2, idBanco: 6, nombre: '15% off con Mastercard', fechaDesde: hoy, fechaHasta: en30, dias: ['lunes', 'martes', 'miercoles', 'jueves'] },
    ], { ignoreDuplicates: true });

    /* =========================
     *  PRODUCTOS (10) + STOCK + PROPIEDADES (5 c/u) + COMENTARIOS (5 c/u)
     * ========================= */
    const productos = Array.from({ length: 10 }, (_, i) => {
      const idx = i + 1;
      return {
        idProducto: idx,
        idCategoria: ((idx - 1) % 10) + 1,
        idSubCategoria: ((idx - 1) % 10) + 1,
        idMarca: ((idx - 1) % 10) + 1,
        nombre: `Producto ${idx}`,
        precio: 100000 + idx * 2500,
        precioAnterior: idx % 2 === 0 ? 120000 + idx * 2500 : null,
        descripcion: `Descripción del producto ${idx}`,
        stock: 50 + idx,
        fotos: [`https://dummyimage.com/800x1200/cccccc/000000&text=Producto+${idx}`],
      };
    });
    await Producto.bulkCreate(productos, { ignoreDuplicates: true });

    const stocks = productos.map(p => ({
      idStock: p.idProducto,        // mismo id para que sea determinístico
      idProducto: p.idProducto,
      stockMinimo: 5,
      stockMaximo: 200,
      stockActual: p.stock,
      reservado: 0,
      comprometido: 0,
      disponibilidad: p.stock,
      estado: 'disponible',
    }));
    await Stock.bulkCreate(stocks, { ignoreDuplicates: true });

    const propiedades = [];
    let propId = 1;
    for (const p of productos) {
      for (let cId = 1; cId <= 5; cId++) {
        propiedades.push({
          idPropiedad: propId++,
          idProducto: p.idProducto,
          idCaracteristica: cId,
          valor: `Valor ${cId} de Producto ${p.idProducto}`,
        });
      }
    }
    await Propiedad.bulkCreate(propiedades, { ignoreDuplicates: true });

    const comentarios = [];
    let comId = 1;
    for (const p of productos) {
      for (let j = 1; j <= 5; j++) {
        comentarios.push({
          idComentario: comId++,
          idProducto: p.idProducto,
          idUsuario: ((p.idProducto + j) % 3) + 1, // 1..3
          puntuacion: rand(3, 5),
          comentario: `Comentario ${j} del producto ${p.idProducto}`,
        });
      }
    }
    await Comentario.bulkCreate(comentarios, { ignoreDuplicates: true });

    /* =========================
     *  PEDIDOS (5) -> 3 electrónicos (con Envío) + 2 efectivo (sin Envío)
     * ========================= */
    const pedidosData = [];
    const detallesData = [];
    const enviosData = [];

    for (let i = 1; i <= 5; i++) {
      const electronico = i <= 3;
      const p1 = productos[(i - 1) % 10];
      const p2 = productos[(i + 2) % 10];
      const cant1 = (i % 3) + 1;
      const cant2 = (i % 2) + 1;

      const subtotal = (Number(p1.precio) * cant1) + (Number(p2.precio) * cant2);
      const impuestos = +(subtotal * 0.21).toFixed(2);
      const total = +(subtotal + impuestos).toFixed(2);

      pedidosData.push({
        idPedido: i,
        idUsuario: userId,
        formaPago: electronico ? 'electronico' : 'efectivo',
        estado: electronico ? 'pagado' : 'pendiente',
        subtotal, impuestos, total,
      });

      detallesData.push(
        { idDetallePedido: i * 2 - 1, idPedido: i, idProducto: p1.idProducto, cantidad: cant1 },
        { idDetallePedido: i * 2, idPedido: i, idProducto: p2.idProducto, cantidad: cant2 },
      );

      if (electronico) {
        enviosData.push({
          idEnvio: i,
          idPedido: i,
          idDireccion: dirUser.idDireccion,
        });
      }
    }

    await Pedido.bulkCreate(pedidosData, { ignoreDuplicates: true });
    await DetallePedido.bulkCreate(detallesData, { ignoreDuplicates: true });
    if (enviosData.length) {
      await Envio.bulkCreate(enviosData, { ignoreDuplicates: true });
    }

    /* =========================
     *  ORDENES DE COMPRA (5) con 2 items cada una
     * ========================= */
    const ocs = [];
    for (let i = 1; i <= 5; i++) {
      ocs.push({
        idOrdenCompra: i,
        estado: i < 4 ? 'pendiente' : 'entregado',
        subtotal: 500000 + i * 10000,
        impuestos: 0,
        total: 500000 + i * 10000,
      });
    }
    await OrdenCompra.bulkCreate(ocs, { ignoreDuplicates: true });

    const itemsOc = [];
    let itemId = 1;
    for (let i = 1; i <= 5; i++) {
      for (let k = 0; k < 2; k++) {
        const p = productos[(i + k) % 10];
        itemsOc.push({
          idItemOrdenCompra: itemId++,
          idOrdenCompra: i,
          idProducto: p.idProducto,
          cantidad: 5 + k * 5, // 5 y 10
        });
      }
    }
    await ItemOrdenCompra.bulkCreate(itemsOc, { ignoreDuplicates: true });

    /* =========================
     *  DEVOLUCIONES (2) sobre pedidos electrónicos
     * ========================= */
    const devoluciones = [
      {
        idDevolucion: 1,
        idPedido: 1,
        idProducto: detallesData.find(d => d.idPedido === 1).idProducto,
        motivo: 'producto_defectuoso',
        comentario: 'Devolución 1',
        estado: 'aprobado',
      },
      {
        idDevolucion: 2,
        idPedido: 2,
        idProducto: detallesData.find(d => d.idPedido === 2).idProducto,
        motivo: 'producto_incorrecto',
        comentario: 'Devolución 2',
        estado: 'revision',
      },
    ];
    await Devolucion.bulkCreate(devoluciones, { ignoreDuplicates: true });

    console.log('✅ Seed completísimo: productos(10), pedidos(5), OC(5), devoluciones(2), comentarios(50), propiedades(50).');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  }
})();
