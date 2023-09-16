const express = require('express');
const { signupUser, loginUser, forgotPassword, resetPassword, getUser, keepAlive } = require('../controllers/userController');
const router = express.Router();

router.get("/keep-alive", keepAlive);
router.post("/signup", signupUser);
router.post('/login', loginUser);
router.get('/getUser/:_id', getUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;