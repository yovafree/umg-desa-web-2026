const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

router.get('/', clientesController.index);
router.get('/nuevo', clientesController.nuevo);
router.post('/', clientesController.create);
router.get('/:id', clientesController.show);
router.get('/:id/editar', clientesController.editar);
router.post('/:id', clientesController.update);
router.post('/:id/eliminar', clientesController.eliminar);

module.exports = router;
