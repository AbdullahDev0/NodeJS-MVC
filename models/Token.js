const { default: mongoose } = require('mongoose');

const TokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expire_at: {type: Date, default: Date.now, expires: 3600}
},
{collection: 'blacklistTokens'}
);
module.exports = Token = mongoose.model('token', TokenSchema);
