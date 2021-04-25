const express = require('express');
const router = express.Router();
const playgrounds = require('../controllers/playgrounds');
const Playground = require('../models/playground');
const { isLoggedIn, isAuthor, validatePlayground } = require('../middleware');

router.get('/', playgrounds.index);

router.get('/new', isLoggedIn, playgrounds.renderNewForm);

router.post('/', isLoggedIn, validatePlayground, playgrounds.create);

router.get('/:id', playgrounds.showPlayground);

router.get('/:id/edit', isLoggedIn, isAuthor, playgrounds.renderEditForm);

router.put('/:id', isLoggedIn, validatePlayground, isAuthor, playgrounds.edit);

router.delete('/:id', isLoggedIn, isAuthor, playgrounds.delete);



module.exports = router;