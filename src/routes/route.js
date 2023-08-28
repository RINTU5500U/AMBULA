const express = require('express')
const router = express.Router()

const {createUser, login, updateUser, getUser} = require('../controllers/userController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/createUser', createUser)
router.post('/login', login)
router.put('/updateUser/userId', authentication, authorization, updateUser)
router.get('/getUser/number', authentication, getUser)
router.all("/*", (req, res) => {
    return res.status(400).send({ status: false, msg: "end point is not valid" });
});

module.exports = router