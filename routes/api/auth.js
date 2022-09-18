const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').exists(),
        check('remeber').optional()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body);
        const { email, password } = req.body;
        // User.findOne
        try {
            let user = await User.findOne({ email: email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            const payload = {
                user: {
                    id: user.id
                },
            };
            let remeber = 3600;
            if (!req.body.remember === null || !req.body.remember === false){
                // console.log("Here")
                remeber = "30d"
            }
            jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { expiresIn: remeber },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
            //   res.send('User Registered!');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }
);

router.post(
    '/logout', auth,
    async (req, res) => {
        try {
            const token = req.header('x-auth-token');
            const Token = require('../../models/Token');
            await (new Token({ token: token })).save();
            res.json({ msg: 'User Logged Out' });

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }

);
module.exports = router;
