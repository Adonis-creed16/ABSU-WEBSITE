const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'absu_secret_key_2026', { expiresIn: '30d' });
};

// @desc Register user
// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, role, faculty, department } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const user = await User.create({ name, email, password, role, faculty, department });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Login user
// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Get Admin Dashboard Stats
// @route GET /api/auth/admin/stats
router.get('/admin/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalPosts = await require('../models/Post').countDocuments();
        res.json({
            students: totalStudents,
            posts: totalPosts,
            faculties: 10, // Mock for now
            health: '98.5%'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Get All Students
// @route GET /api/auth/admin/students
router.get('/admin/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
