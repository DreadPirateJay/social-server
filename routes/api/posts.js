const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/posts');

// @route   GET api/posts/test
// @desc    Test posts route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works!" }));

// @route   GET api/posts
// @desc    Get posts 
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ notfound: 'Post not found' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post 
// @access  Private
router.delete("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({ unauthorized: 'Unauthorize to delete post' })
      }

      post.remove().then(() => res.json({ success: true }))
    })
    .catch(err => res.status(404).json({ notfound: 'Post not found'}));
});

// @route   POST api/posts/like/:id
// @desc    Like a post 
// @access  Private
router.post("/like/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        post.likes = post.likes.filter(like => like.user.toString() !== req.user.id)
      } else {
        post.likes.push({ user: req.user.id });
      }
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ notfound: 'Post not found'}));
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      post.comments.push({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      });
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ notfound: 'Post not found'}));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotfound: 'Comment not found' });
      }

      const removeIndex = post.comments
        .map(comment => comment._id.toString())
        .indexOf(req.params.comment_id)

      if(post.comments[removeIndex].user.toString() !== req.user.id) {
        return res.status(400).json({ unauthorized: 'User not authrized' })
      }

      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ notfound: 'Post not found'}));
});

module.exports = router;
