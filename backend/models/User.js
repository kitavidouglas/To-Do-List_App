import { Schema, models, model } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';

// Define the user schema
const userSchema = new Schema({
    username: { type: String, unique: true }, // Optional if you are using email as unique identifier
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Use a pattern to avoid overwriting the model
const User = models.User || model('User', userSchema);

export default User;

