// Modelo de Cliente (datos en memoria, simula una base de datos)

let clientes = [
  { id: 1, nombre: 'Ana López', email: 'ana.lopez@example.com', telefono: '5555-1234' },
  { id: 2, nombre: 'Carlos Pérez', email: 'carlos.perez@example.com', telefono: '5555-5678' },
  { id: 3, nombre: 'María Gómez', email: 'maria.gomez@example.com', telefono: '5555-9012' },
];

function getAll() {
  return clientes;
}

function getById(id) {
  return clientes.find((cliente) => cliente.id === Number(id));
}

function create({ nombre, email, telefono }) {
  const nuevoCliente = {
    id: clientes.length ? Math.max(...clientes.map((c) => c.id)) + 1 : 1,
    nombre,
    email,
    telefono,
  };
  clientes.push(nuevoCliente);
  return nuevoCliente;
}

function update(id, { nombre, email, telefono }) {
  const cliente = getById(id);
  if (!cliente) return null;

  cliente.nombre = nombre;
  cliente.email = email;
  cliente.telefono = telefono;
  return cliente;
}

function remove(id) {
  const index = clientes.findIndex((cliente) => cliente.id === Number(id));
  if (index === -1) return false;

  clientes.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
