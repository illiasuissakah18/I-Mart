const express = require("express");
const router = express.Router();
const auth = require("../middleware/sellerAuth");
const { registerSeller, loginSeller, getSellerProfile, updateSellerProfile, getSellerStats } = require("../controllers/sellerController");

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/profile", auth, getSellerProfile);
router.put("/profile", auth, updateSellerProfile);
router.get("/stats", auth, getSellerStats);

module.exports = router;
