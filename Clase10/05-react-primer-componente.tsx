// 05 - Introducción a React con TypeScript
// Este archivo depende de React. Para ejecutarlo se necesita un proyecto React con soporte TypeScript
// (por ejemplo creado con Vite: npm create vite@latest -- --template react-ts)

import React, { useState } from "react";

// ---------------------------------------------
// 1. Componente Saludo: recibe una prop tipada
// ---------------------------------------------

// La interfaz describe las props que el componente espera recibir
interface SaludoProps {
  nombre: string;
}

const Saludo: React.FC<SaludoProps> = ({ nombre }) => {
  return <h2>¡Hola, {nombre}! Bienvenido a la clase de Desarrollo Web.</h2>;
};

// ---------------------------------------------
// 2. Componente Contador: usa useState<number>
// ---------------------------------------------

const Contador: React.FC = () => {
  // useState<number> indica explícitamente que el estado "valor" es de tipo number
  const [valor, setValor] = useState<number>(0);

  // Al hacer click, incrementamos el valor actual en 1
  const incrementar = () => setValor(valor + 1);

  return (
    <div>
      <p>Valor actual: {valor}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  );
};

// ---------------------------------------------
// 3. Componente ListaProductos: recibe un array de Producto como prop
// ---------------------------------------------

// Misma interfaz utilizada en el archivo 03-tipos-y-funciones.ts
interface Producto {
  nombre: string;
  precio: number;
  categoria: string;
}

interface ListaProductosProps {
  productos: Producto[];
}

const ListaProductos: React.FC<ListaProductosProps> = ({ productos }) => {
  return (
    <ul>
      {productos.map((producto) => (
        // "key" es obligatorio en React para identificar cada elemento de la lista
        <li key={producto.nombre}>
          {producto.nombre} - Q{producto.precio} ({producto.categoria})
        </li>
      ))}
    </ul>
  );
};

// ---------------------------------------------
// 4. Componente App: combina los tres componentes anteriores
// ---------------------------------------------

// Datos de prueba hardcodeados para mostrar el uso de ListaProductos
const productosDePrueba: Producto[] = [
  { nombre: "Laptop", precio: 8500, categoria: "Electrónica" },
  { nombre: "Camisa", precio: 200, categoria: "Ropa" },
  { nombre: "Cuaderno", precio: 25, categoria: "Papelería" },
];

const App: React.FC = () => {
  return (
    <div>
      <Saludo nombre="Estudiante" />
      <Contador />
      <h3>Lista de productos</h3>
      <ListaProductos productos={productosDePrueba} />
    </div>
  );
};

export default App;

// Preguntas de reflexión:
// 1. ¿Por qué es importante usar una interfaz para tipar las props de un componente?
// 2. ¿Qué pasaría si useState no tuviera el tipo <number> explícito? ¿TypeScript podría inferirlo igual?
