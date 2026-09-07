// Controlador de Productos: recibe las peticiones, usa el modelo y renderiza la vista

const productoModel = require('../models/producto.model');

// GET /productos -> lista todos los productos
function index(req, res) {
  const productos = productoModel.getAll();
  res.render('productos/index', { titulo: 'Productos', productos });
}

// GET /productos/nuevo -> formulario de creación
function nuevo(req, res) {
  res.render('productos/nuevo', { titulo: 'Nuevo producto' });
}

// GET /productos/:id -> detalle de un producto
function show(req, res) {
  const producto = productoModel.getById(req.params.id);

  if (!producto) {
    return res.status(404).render('productos/404', { titulo: 'Producto no encontrado' });
  }

  res.render('productos/show', { titulo: producto.nombre, producto });
}

// POST /productos -> crea un producto y redirige al listado
function create(req, res) {
  const { nombre, precio, stock } = req.body;
  productoModel.create({ nombre, precio, stock });
  res.redirect('/productos');
}

// GET /productos/:id/editar -> formulario de edición
function editar(req, res) {
  const producto = productoModel.getById(req.params.id);

  if (!producto) {
    return res.status(404).render('productos/404', { titulo: 'Producto no encontrado' });
  }

  res.render('productos/editar', { titulo: 'Editar producto', producto });
}

// POST /productos/:id -> actualiza un producto y redirige al listado
function update(req, res) {
  const { nombre, precio, stock } = req.body;
  const producto = productoModel.update(req.params.id, { nombre, precio, stock });

  if (!producto) {
    return res.status(404).render('productos/404', { titulo: 'Producto no encontrado' });
  }

  res.redirect('/productos');
}

// POST /productos/:id/eliminar -> elimina un producto y redirige al listado
function eliminar(req, res) {
  productoModel.remove(req.params.id);
  res.redirect('/productos');
}

module.exports = {
  index,
  nuevo,
  show,
  create,
  editar,
  update,
  eliminar,
};
