import express from 'express'
import userController from '../controllers/user/user.controller.js'

import jwt from 'express-jwt'
var auth = jwt({
    secret: 'SIIMA',
    userProperty: 'payload'
});

const router = express.Router();

//creat user
router.post("/", (req, res) => {
    validateUser.call(req, res);
});

//delete user
router.delete("/:id", (req, res) => {
    signinUser.call(req, res);
});

//change specific info of user
router.patch("/:id", (req, res) => {
    setUserPassword.call(req, res);
});

//query user 
router.get("/:id", (req, res) => {
    createUser.call(req, res);
});

//#############################
router.post("/signin", (req, res) => {
    signinUser.call(req, res);
});

router.get("/:userId/signout", auth, signoutUser.call, (req, res) => {
    signoutUser.call(req, res);
});

router.post("/:userId/validate", (req, res) => {
    validateUser.call(req, res);
});
//############################

module.exports = router;


