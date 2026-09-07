const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.index);
router.get('/nuevo', productosController.nuevo);
router.post('/', productosController.create);
router.get('/:id', productosController.show);
router.get('/:id/editar', productosController.editar);
router.post('/:id', productosController.update);
router.post('/:id/eliminar', productosController.eliminar);

module.exports = router;
