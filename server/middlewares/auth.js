import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization) {
            token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } else {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized as an admin' });
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const adminOrOwner = async (req, res, next) => {
    try {
        if (req.user && (req.user.role === 'admin' || req.user.id === req.params.id)) {
            next();
        } else {
            return res.status(401).json({ message: 'You don`t have permission for this action' });
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export { protect, admin, adminOrOwner };
