// 02 - Estructuras de control en TypeScript
// Este archivo puede ejecutarse de forma independiente con: npx ts-node 02-estructuras-control.ts

// ---------------------------------------------
// 1. if / else if / else
// ---------------------------------------------

const nota: number = 85;

if (nota >= 90) {
  console.log("Calificación: Excelente");
} else if (nota >= 70) {
  console.log("Calificación: Bueno");
} else {
  console.log("Calificación: Necesita mejorar");
}

// ---------------------------------------------
// 2. switch
// ---------------------------------------------

const diaSemana: number = 3;
let nombreDia: string;

switch (diaSemana) {
  case 1:
    nombreDia = "Lunes";
    break;
  case 2:
    nombreDia = "Martes";
    break;
  case 3:
    nombreDia = "Miércoles";
    break;
  default:
    nombreDia = "Día no válido";
}

console.log("Día de la semana:", nombreDia);

// ---------------------------------------------
// 3. Operador ternario
// ---------------------------------------------

// Forma corta de un if/else que retorna un valor
const edad: number = 17;
const esMayorDeEdad: string = edad >= 18 ? "Es mayor de edad" : "Es menor de edad";
console.log(esMayorDeEdad);

// ---------------------------------------------
// 4. Cuatro tipos de loops
// ---------------------------------------------

// for: cuando conocemos la cantidad de iteraciones
for (let i = 0; i < 3; i++) {
  console.log("for -> iteración", i);
}

// while: repite mientras la condición sea verdadera
let contador = 0;
while (contador < 3) {
  console.log("while -> contador", contador);
  contador++;
}

// for...of: recorre los VALORES de un array u objeto iterable
const colores: string[] = ["rojo", "verde", "azul"];
for (const color of colores) {
  console.log("for...of -> color", color);
}

// for...in: recorre las CLAVES (índices o propiedades) de un objeto o array
const persona = { nombre: "Elena", pais: "Guatemala" };
for (const clave in persona) {
  console.log("for...in -> clave", clave, "valor", (persona as any)[clave]);
}

// ---------------------------------------------
// 5. Clasificación de productos por categoría
// ---------------------------------------------

// Interfaz que describe la forma de un producto
interface Producto {
  nombre: string;
  precio: number;
  categoria: string;
}

// Recibe un array de productos y los agrupa por categoría
function clasificarPorCategoria(productos: Producto[]): Record<string, Producto[]> {
  const agrupados: Record<string, Producto[]> = {};

  for (const producto of productos) {
    // Si la categoría todavía no existe en el objeto, la inicializamos con un array vacío
    if (!agrupados[producto.categoria]) {
      agrupados[producto.categoria] = [];
    }
    agrupados[producto.categoria].push(producto);
  }

  return agrupados;
}

const productosEjemplo: Producto[] = [
  { nombre: "Laptop", precio: 8500, categoria: "Electrónica" },
  { nombre: "Mouse", precio: 150, categoria: "Electrónica" },
  { nombre: "Camisa", precio: 200, categoria: "Ropa" },
  { nombre: "Pantalón", precio: 350, categoria: "Ropa" },
];

console.log("Productos agrupados:", clasificarPorCategoria(productosEjemplo));

// Preguntas de reflexión:
// 1. ¿Cuándo conviene usar for...of en lugar de for...in?
// 2. ¿Qué otra estructura de datos (además de un objeto) podríamos usar para agrupar los productos?
