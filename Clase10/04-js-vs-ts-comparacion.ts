// 04 - Comparación JavaScript vs TypeScript
// Este archivo puede ejecutarse de forma independiente con: npx ts-node 04-js-vs-ts-comparacion.ts
// Problema a resolver en ambas versiones: sumar los precios de una lista de productos

// ---------------------------------------------
// Versión JavaScript (sin tipos)
// ---------------------------------------------

// En JavaScript no declaramos tipos: "productos" podría recibir CUALQUIER cosa
// y el error solo aparecería en tiempo de ejecución, no antes.
/*
// versión JavaScript
function sumarPreciosJS(productos) {
  let total = 0;
  for (const producto of productos) {
    total += producto.precio; // si "producto.precio" no existe o no es número, falla en tiempo de ejecución
  }
  return total;
}

const productosJS = [
  { nombre: "Libro", precio: 100 },
  { nombre: "Lápiz", precio: 5 },
];

console.log(sumarPreciosJS(productosJS));
*/

// ---------------------------------------------
// Versión TypeScript (con tipos)
// ---------------------------------------------

// versión TypeScript
interface ProductoSimple {
  nombre: string;
  precio: number;
}

// El compilador nos avisa ANTES de ejecutar si "productos" no cumple con la forma esperada
function sumarPreciosTS(productos: ProductoSimple[]): number {
  let total = 0;
  for (const producto of productos) {
    total += producto.precio; // TypeScript garantiza que "precio" siempre es number
  }
  return total;
}

const productosTS: ProductoSimple[] = [
  { nombre: "Libro", precio: 100 },
  { nombre: "Lápiz", precio: 5 },
];

console.log("Total (TypeScript):", sumarPreciosTS(productosTS));

// Si intentáramos hacer esto, TypeScript marcaría un error en tiempo de compilación:
// sumarPreciosTS([{ nombre: "Error", precio: "cinco" }]); // Error: "cinco" no es number

// Preguntas de reflexión:
// 1. ¿En qué momento detecta el error la versión JavaScript vs la versión TypeScript?
// 2. ¿Qué problemas en producción se podrían evitar gracias al tipado estático?
