var express = require("express");
var router = express.Router();
var bicicletaApiController = require("../../controllers/api/bicicletaControllerApi");

router.get('/', bicicletaApiController.bicicleta_list);
router.post('/create', bicicletaApiController.bicicleta_create);
router.delete('/delete', bicicletaApiController.bicicleta_delete);

module.exports = router;