const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');

// @desc Get all posts (with pagination)
// @route GET /api/posts
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    try {
        const total = await Post.countDocuments();
        const posts = await Post.find()
            .populate('user', 'name profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            posts,
            page,
            pages: Math.ceil(total / limit),
            hasMore: skip + posts.length < total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Create a post
// @route POST /api/posts
router.post('/', protect, async (req, res) => {
    const { title, content, category, image } = req.body;
    try {
        const post = await Post.create({
            user: req.user._id,
            title, content, category, image
        });
        const fullPost = await Post.findById(post._id).populate('user', 'name');
        res.status(201).json(fullPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc Delete a post
// @route DELETE /api/posts/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            await post.remove();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
