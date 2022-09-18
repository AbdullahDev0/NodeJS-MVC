const User = require("../../models/User");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require('bcryptjs');
const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
const { check, validationResult } = require('express-validator');


router.post("/",
    [
        check('email', 'Email is required').isEmail(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const email = req.body.email;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            const payload = {
                user: {
                    id: user._id,
                }
            }
            jwt.sign(payload,
                process.env.TOKEN_SECRET,
                { expiresIn: 3600 },
                async (err, token) => {
                    if (err) throw err;
                    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
                    await sendEmail(user.email, "Password reset", link);
                    res.send("password reset link sent to your email account");
                }
            );

        } catch (error) {
            res.send("An error occured");
            console.log(error);
        }
    });

router.post("/:userId/:token",
    [
        check('password', 'Minimum 6 characters required').isLength({ min: 6 }),
        check('confirm_password', 'Minimum 6 characters required').isLength({ min: 6 }),
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { password, confirm_password } = req.body;

            const user = await User.findById(req.params.userId);
            if (!user) return res.status(400).send("invalid link");
            try {
                jwt.verify(req.params.token, process.env.TOKEN_SECRET);
            } catch (error) {
                console.log(error)
                res.status(401).json({ msg: 'Token is not valid or expireed!' });
            }
            if (password !== confirm_password) {
                return res.status(400).json({ errors: [{ msg: 'Password Mismatch' }] });
            }
            const salt = await bcrypt.genSalt(10);
            const encrypt_password = await bcrypt.hash(password, salt);

            user.password = encrypt_password;
            await user.save();
            res.send("password reset sucessfully.");
        } catch (error) {
            res.send("An error occured");
            console.log(error);
        }
    });

module.exports = router;
