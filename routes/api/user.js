const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();


const User = require('../../models/User');
const Roles = require('../../models/Roles');
const authorize = require('../../middleware/authorize');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Minimum 6 characters required').isLength({ min: 6 }),
        check('confirm_password', 'Minimum 6 characters required').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body)
        const { name, email, password, confirm_password, role } = req.body;
        // User.findOne
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            if(password !== confirm_password){
                return res.status(400).json ({ errors: [{ msg: 'Password Mismatch' }] });
            }
            const userRole = await Roles.findOne({ role: role })
            if (!userRole) {
                return res.status(400).json({ errors: [{ msg: 'Role does not exist' }] });
            }
            user = new User({
                name,
                email,
                password,
                role
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {
                user: {
                    id: user.id,
                }
            }
            jwt.sign(payload,
                process.env.TOKEN_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                }
            );
            //   res.send('User Registered!');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }

    }
);



// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, authorize("admin"), async (req, res) => {
    try {
        const posts = await User.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/user/:id
// @desc    Get user by id
// @access  Private
router.post('/:id', auth,  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(500).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId')
            return res.status(500).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/user/:id
// @desc    Delete a user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(500).json({ msg: 'User not found' });
        // console.log(user);

        await user.remove();
        res.json({ msg: 'User Removed!' });
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId')
            return res.status(500).json({ msg: 'User not found' });
        res.status(500).send('Server Error');   
    }
});



// @route   PATCH api/user/:id
// @desc    Update user
// @access  Public
router.patch(
    '/:id',
    [
        check('name', 'Name is required').not().isEmpty().optional(),
        check('email', 'Email is required').optional(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body)
        const { name, email, password } = req.body;
        // User.findOne
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'Email already taken' }] });
            }
            user = await User.findById(req.params.id);
            if (user) {
                // update
                const newUser = req.body

                updateData = await User.findOneAndUpdate(
                    { user: req.params.id },
                    { $set: newUser },
                    { new: true }
                );
                return res.json(updateData);
            }
            //   res.send('User Registered!');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }

    }
);



module.exports = router;
