import Ad from '../models/Ad.js';

const checkAdOwnerOrAdmin = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad.creator.toString() === req.user._id.toString() || req.user.role === 'admin') {
            req.ad = ad;
            next();
        } else {
            return res.status(403).json({ message: 'You are not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default checkAdOwnerOrAdmin;
