
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
    },
    profilePictureId: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);

module.exports = user;