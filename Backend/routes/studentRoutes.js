const express = require("express");
const { addStudent, viewStudent } = require("../controllers/studentController");
const { protectRector } = require("../Middleware/protectMiddleware");

const router = express.Router();

router.post("/addStudent", protectRector, addStudent);
router.get("/viewStudent", protectRector, viewStudent);

module.exports = router;
