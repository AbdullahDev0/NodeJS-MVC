const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, Authorization denied' });
    }
    try {
        const Token = require('../models/Token');
        const authToken = await Token.findOne({ token: token })
        if (authToken) {
            return res.status(401).json({  msg: 'Expired token, Authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded.user.id;
        // console.log(decoded.user.id)
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid!' });
    }
};
