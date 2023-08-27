const router = require("express").Router();
const hiringController = require("../controllers/hiringController");
const {validateToken} = require('../utils/JWT')

router.post("/",validateToken, hiringController.makePost);

module.exports = router;
