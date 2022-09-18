const { default: mongoose } = require('mongoose');

const RoleSchema = mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
},
{collection: 'roles'}
);
module.exports = Roles = mongoose.model('role', RoleSchema);
