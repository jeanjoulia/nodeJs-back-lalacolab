
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    profilePictureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);

module.exports = user;