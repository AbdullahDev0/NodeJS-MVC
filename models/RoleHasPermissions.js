const { default: mongoose } = require('mongoose');

const RoleHasPermissionsSchema = mongoose.Schema({
    roleID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "role",
    },
    permissionID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "permission",
    },
},
{collection: 'role-has-permissions'}
);
module.exports = RoleHasPermissions = mongoose.model('role-has-permissions', RoleHasPermissionsSchema);
