import { sign, verify } from 'jsonwebtoken';
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (user) => {
    return sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
    return verify(token, JWT_SECRET);
};

export default { generateToken, verifyToken };
