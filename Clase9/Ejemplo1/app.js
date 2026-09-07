const path = require('path');
const express = require('express');

const productosRoutes = require('./routes/productos.routes');
const clientesRoutes = require('./routes/clientes.routes');

const app = express();

// Configuración del motor de vistas (Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Para leer datos de formularios (req.body)
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/productos');
});

app.use('/productos', productosRoutes);
app.use('/clientes', clientesRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
