const Roles = require("../models/Roles");
const newRole = async (role) => {
    await new Roles({
        role: role
    }).save();
}
module.exports = newRole;
