import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isUserValidated = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization : null;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                if (user.isVerified === true || user.role === 'admin') {
                    req.user = user;
                    next();
                } else {
                    res.status(403).json({ message: 'User is not validated' });
                }
            } else {
                res.status(403).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
};

export default isUserValidated;