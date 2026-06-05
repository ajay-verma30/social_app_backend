const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/new', verifyToken, postController.postCreation);
router.get('/all', verifyToken, postController.fetchPosts);

module.exports = router;