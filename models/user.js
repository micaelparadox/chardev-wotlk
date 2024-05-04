const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
