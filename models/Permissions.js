const { default: mongoose } = require('mongoose');

const PermissionSchema = mongoose.Schema({
    permission: {
        type: String,
        required: true,
    },
},
{collection: 'permission'}
);
module.exports = Permissions = mongoose.model('permission', PermissionSchema);
