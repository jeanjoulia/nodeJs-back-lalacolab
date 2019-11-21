import express from 'express'
import userController from '../controllers/user/user.controller.js'

import jwt from 'express-jwt'
var auth = jwt({
    secret: 'SIIMA',
    userProperty: 'payload'
});

const router = express.Router();

//create user
router.post("/", (req, res) => {
    userController.create(req, res);
});

//get user
router.get("/:id", (req, res) => {
    userController.get(req, res);
});

//delete user
router.delete("/:id", (req, res) => {
    userController.delete(req, res);
});

//change specific info of user
router.patch("/:id", (req, res) => {
    userController.patch(req, res);
});

//query user 
router.get("/", (req, res) => {
    userController.query(req, res);
});

//sign in the app
router.post("/signin", (req, res) => {
    userController.signIn(req, res);
});

//sign out of the app
router.get("/:userId/signout", auth, (req, res) => {
    userController.signOut(req, res);
});

//validate the user once created
router.post("/:userId/validate", (req, res) => {
    userController.validate(req, res);
});

module.exports = router;


