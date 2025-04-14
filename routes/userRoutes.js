const express = require("express");
const { bookFreeTrial,
     loginStudent,
      currentUser ,
       getStudentCalendarEvents
    } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/free-trial", bookFreeTrial);

router.post("/student/login", loginStudent);

router.get("/current",validateToken, currentUser);

router.get("/calenderevents", getStudentCalendarEvents);


module.exports = router;