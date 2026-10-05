// 01 - Sintaxis fundamental de TypeScript
// Este archivo puede ejecutarse de forma independiente con: npx ts-node 01-sintaxis-fundamental.ts

// ---------------------------------------------
// 1. Declaración de variables: let y const
// ---------------------------------------------

// Tipado explícito: le decimos a TypeScript el tipo que debe tener la variable
let edadExplicita: number = 25;

// Tipado inferido: TypeScript deduce el tipo automáticamente según el valor asignado
let edadInferida = 30; // TypeScript infiere que es "number"

// const se usa cuando el valor no va a cambiar (referencia constante)
const nombreCurso: string = "Desarrollo Web";

// Con let sí podemos reasignar el valor
edadExplicita = 26;
console.log("Edad explícita:", edadExplicita);
console.log("Edad inferida:", edadInferida);

// ---------------------------------------------
// 2. Tipos primitivos
// ---------------------------------------------

let unString: string = "Hola mundo";
let unNumero: number = 42;
let unBooleano: boolean = true;
let unNulo: null = null;
let unIndefinido: undefined = undefined;

console.log({ unString, unNumero, unBooleano, unNulo, unIndefinido });

// ---------------------------------------------
// 3. Template literals (plantillas de texto)
// ---------------------------------------------

// Permiten insertar variables dentro de un string usando ${}
const estudiante = "Ana";
const nota = 95;
const mensaje = `El estudiante ${estudiante} obtuvo una nota de ${nota} puntos.`;
console.log(mensaje);

// ---------------------------------------------
// 4. Array tipado de objetos simples
// ---------------------------------------------

// Definimos un array donde cada elemento debe tener "nombre" y "edad"
const estudiantes: { nombre: string; edad: number }[] = [
  { nombre: "Carlos", edad: 22 },
  { nombre: "Lucía", edad: 24 },
  { nombre: "Miguel", edad: 21 },
];

console.log("Lista de estudiantes:", estudiantes);

// ---------------------------------------------
// 5. Comparación === vs ==
// ---------------------------------------------

// == compara solo el valor, convirtiendo tipos automáticamente (coerción)
// === compara valor Y tipo, sin conversión automática (recomendado en TypeScript)
const numeroComoTexto = "5";
const numero = 5;

console.log("'5' == 5 ->", numeroComoTexto == numero); // true, porque hace coerción de tipos
console.log("'5' === 5 ->", numeroComoTexto === numero); // false, porque los tipos son distintos (string vs number)

// Preguntas de reflexión:
// 1. ¿Por qué se recomienda usar === en vez de == en TypeScript/JavaScript?
// 2. ¿Qué ventaja tiene el tipado explícito frente al tipado inferido cuando trabajamos en equipo?
