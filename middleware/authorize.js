const User = require('../models/User')
const authorize = (role) => {
    // console.log(role)
    return [
        async (req, res, next) => {
            // console.log(req);
            const user = await User.findById(req.user)
            if (role!==user.role) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            next();
        }
    ]


}

module.exports = authorize