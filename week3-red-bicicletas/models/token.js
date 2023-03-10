const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    _userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: 43200
    }
});

tokenSchema.statics.deleteTokens = function(_userid){
    return this.deleteMany({_userid: _userid}).then((ans) => console.log(ans));
}

module.exports = mongoose.model('Token', tokenSchema);