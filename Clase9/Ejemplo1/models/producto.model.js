// Modelo de Producto (datos en memoria, simula una base de datos)

let productos = [
  { id: 1, nombre: 'Laptop', precio: 4500.00, stock: 10 },
  { id: 2, nombre: 'Mouse', precio: 75.50, stock: 50 },
  { id: 3, nombre: 'Teclado', precio: 150.00, stock: 30 },
];

function getAll() {
  return productos;
}

function getById(id) {
  return productos.find((producto) => producto.id === Number(id));
}

function create({ nombre, precio, stock }) {
  const nuevoProducto = {
    id: productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
    nombre,
    precio: Number(precio),
    stock: Number(stock),
  };
  productos.push(nuevoProducto);
  return nuevoProducto;
}

function update(id, { nombre, precio, stock }) {
  const producto = getById(id);
  if (!producto) return null;

  producto.nombre = nombre;
  producto.precio = Number(precio);
  producto.stock = Number(stock);
  return producto;
}

function remove(id) {
  const index = productos.findIndex((producto) => producto.id === Number(id));
  if (index === -1) return false;

  productos.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
