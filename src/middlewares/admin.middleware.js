import { USER_ROLES } from '../constants/types.js';

const adminMiddleware = (req, res, next) => {
    const role = req.user.role;

    console.log({ role });

    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SYS_ADMIN) {
        return res.status(403).json({
            error: 'Admin resources access denied',
        });
    }
    next();
};

export default adminMiddleware;
