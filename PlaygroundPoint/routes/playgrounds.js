const express = require('express');
const router = express.Router();
const playgrounds = require('../controllers/playgrounds');
const Playground = require('../models/playground');
const { isLoggedIn, isAuthor, validatePlayground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(playgrounds.index)
    .post(isLoggedIn, upload.array('image'), validatePlayground, playgrounds.create);
 
      
router.get('/new', isLoggedIn, playgrounds.renderNewForm);

router.route('/:id')
    .get(playgrounds.showPlayground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePlayground, playgrounds.edit)
    .delete(isLoggedIn, isAuthor, playgrounds.destroy);

router.get('/:id/edit', isLoggedIn, isAuthor, playgrounds.renderEditForm);

module.exports = router;