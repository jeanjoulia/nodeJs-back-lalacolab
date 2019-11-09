import express from 'express'
import mediaController from '../controllers/media/media.controller.js'

import jwt from 'express-jwt'
var auth = jwt({
    secret: 'SIIMA',
    userProperty: 'payload'
});

const router = express.Router();

//get the image
router.get("/:id", (req, res) => {
    mediaController.getMediaImage(req, res);
});

module.exports = router;


