// Controlador de Clientes: recibe las peticiones, usa el modelo y renderiza la vista

const clienteModel = require('../models/cliente.model');

// GET /clientes -> lista todos los clientes
function index(req, res) {
  const clientes = clienteModel.getAll();
  res.render('clientes/index', { titulo: 'Clientes', clientes });
}

// GET /clientes/nuevo -> formulario de creación
function nuevo(req, res) {
  res.render('clientes/nuevo', { titulo: 'Nuevo cliente' });
}

// GET /clientes/:id -> detalle de un cliente
function show(req, res) {
  const cliente = clienteModel.getById(req.params.id);

  if (!cliente) {
    return res.status(404).render('clientes/404', { titulo: 'Cliente no encontrado' });
  }

  res.render('clientes/show', { titulo: cliente.nombre, cliente });
}

// POST /clientes -> crea un cliente y redirige al listado
function create(req, res) {
  const { nombre, email, telefono } = req.body;
  clienteModel.create({ nombre, email, telefono });
  res.redirect('/clientes');
}

// GET /clientes/:id/editar -> formulario de edición
function editar(req, res) {
  const cliente = clienteModel.getById(req.params.id);

  if (!cliente) {
    return res.status(404).render('clientes/404', { titulo: 'Cliente no encontrado' });
  }

  res.render('clientes/editar', { titulo: 'Editar cliente', cliente });
}

// POST /clientes/:id -> actualiza un cliente y redirige al listado
function update(req, res) {
  const { nombre, email, telefono } = req.body;
  const cliente = clienteModel.update(req.params.id, { nombre, email, telefono });

  if (!cliente) {
    return res.status(404).render('clientes/404', { titulo: 'Cliente no encontrado' });
  }

  res.redirect('/clientes');
}

// POST /clientes/:id/eliminar -> elimina un cliente y redirige al listado
function eliminar(req, res) {
  clienteModel.remove(req.params.id);
  res.redirect('/clientes');
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
