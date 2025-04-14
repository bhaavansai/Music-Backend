const express = require("express");
const { loginAdmin, searchInNewStudentsAPI } = require("../controllers/adminController");
const router = express.Router();


router.post("/admin/login", loginAdmin);

router.get("/admin/searchinnewstudentsAPI", searchInNewStudentsAPI);

module.exports = router;