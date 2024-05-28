import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isUserValidated = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization ? req.headers.authorization : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user && (user.isValidated === true || user.role === 'admin')) {
                req.user = user;
                next();
            } else {
                res.status(403).json({ message: 'User is not validated' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};

export default isUserValidated;
