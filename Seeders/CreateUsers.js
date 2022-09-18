const bcrypt = require('bcryptjs');
const User = require('../models/User');

const newUser = async (userJSON) => {
    let user = new User(userJSON)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
}
module.exports = newUser;
