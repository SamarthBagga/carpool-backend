const { Router } = require("express");
const defaultController = require("../controllers/default.controller");

const router = Router();

router.all("*", defaultController.defaultHandler);

module.exports = router;
