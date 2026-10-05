// 03 - Tipos y funciones en TypeScript
// Este archivo puede ejecutarse de forma independiente con: npx ts-node 03-tipos-y-funciones.ts

// ---------------------------------------------
// 1. Interfaz Producto
// ---------------------------------------------

interface Producto {
  nombre: string;
  precio: number;
  categoria: string;
}

// ---------------------------------------------
// 2. Función tipada: calcular el valor total de un array de productos
// ---------------------------------------------

// Parámetros y retorno están explícitamente tipados
function calcularTotal(productos: Producto[]): number {
  let total = 0;
  for (const producto of productos) {
    total += producto.precio;
  }
  return total;
}

const carrito: Producto[] = [
  { nombre: "Teclado", precio: 300, categoria: "Electrónica" },
  { nombre: "Cuaderno", precio: 25, categoria: "Papelería" },
];

console.log("Total del carrito:", calcularTotal(carrito));

// ---------------------------------------------
// 3. Parámetro opcional y valor por defecto
// ---------------------------------------------

// "descuento" es opcional (puede omitirse) gracias al "?"
// "impuesto" tiene un valor por defecto si no se envía
function calcularTotalConDescuento(
  productos: Producto[],
  descuento?: number,
  impuesto: number = 0.12
): number {
  const totalBase = calcularTotal(productos);
  const totalConDescuento = descuento ? totalBase - descuento : totalBase;
  return totalConDescuento * (1 + impuesto);
}

console.log("Total con descuento:", calcularTotalConDescuento(carrito, 50));
console.log("Total sin descuento (usa impuesto por defecto):", calcularTotalConDescuento(carrito));

// ---------------------------------------------
// 4. La misma función como función flecha (arrow function)
// ---------------------------------------------

const calcularTotalFlecha = (productos: Producto[]): number => {
  let total = 0;
  for (const producto of productos) {
    total += producto.precio;
  }
  return total;
};

console.log("Total (función flecha):", calcularTotalFlecha(carrito));

// ---------------------------------------------
// 5. Función genérica
// ---------------------------------------------

// <T> permite que la función funcione con cualquier tipo de dato, manteniendo el tipo original
function primero<T>(lista: T[]): T {
  return lista[0];
}

console.log("Primer producto:", primero(carrito));
console.log("Primer número:", primero([10, 20, 30]));
console.log("Primer color:", primero(["rojo", "verde", "azul"]));

// Preguntas de reflexión:
// 1. ¿Qué ventaja da usar genéricos (<T>) en vez de usar "any" en la función primero?
// 2. ¿Qué diferencia práctica hay entre un parámetro opcional (?) y uno con valor por defecto?
