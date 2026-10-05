import type { Producto, ProductoInput } from '../types/producto';

// Fake backend: simula latencia de red y persiste en memoria durante la sesión.
let productos: Producto[] = [
  { id: 1, nombre: 'Teclado mecánico', categoria: 'Periféricos', precio: 350.5, stock: 20 },
  { id: 2, nombre: 'Mouse inalámbrico', categoria: 'Periféricos', precio: 180, stock: 35 },
  { id: 3, nombre: 'Monitor 24"', categoria: 'Monitores', precio: 1250, stock: 8 },
  { id: 4, nombre: 'Laptop 14"', categoria: 'Computadoras', precio: 6800, stock: 5 },
];

let nextId = productos.length + 1;

const LATENCIA_MS = 500;

function delay<T>(valor: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), LATENCIA_MS));
}

export async function listarProductos(): Promise<Producto[]> {
  return delay([...productos]);
}

export async function crearProducto(input: ProductoInput): Promise<Producto> {
  const nuevo: Producto = { id: nextId++, ...input };
  productos = [...productos, nuevo];
  return delay(nuevo);
}

export async function actualizarProducto(id: number, input: ProductoInput): Promise<Producto> {
  const existe = productos.find((p) => p.id === id);
  if (!existe) {
    throw new Error(`Producto con id ${id} no encontrado`);
  }
  const actualizado: Producto = { id, ...input };
  productos = productos.map((p) => (p.id === id ? actualizado : p));
  return delay(actualizado);
}

export async function eliminarProducto(id: number): Promise<void> {
  productos = productos.filter((p) => p.id !== id);
  return delay(undefined);
}
