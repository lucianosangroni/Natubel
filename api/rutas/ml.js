const express = require("express")
const router = express.Router();
const {
    getFirstToken,
    createItem,
    desvincularItem,
    responderWebhook,
    } = require("../controllers/mercadolibre");
const { validateId } = require("../validators/id")
const { checkAuth } = require("../middlewares/auth")

router.get("/callback", getFirstToken)
router.post("/:id", checkAuth, validateId, createItem);
router.put("/:id", checkAuth, validateId, desvincularItem);
router.post("/webhook", responderWebhook)

module.exports = router