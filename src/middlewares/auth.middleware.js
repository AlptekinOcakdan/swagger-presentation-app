import passport from 'passport';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(req.originalUrl);
    if (req.originalUrl.includes('/auth')) {
        return next();
    }
    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user)
            return res.status(401).json({
                success: false,
                data: null,
                message: 'Unauthorized Access - No Token Provided!',
            });
        req.user = user;
        next();
    })(req, res, next);
};

export default authMiddleware;
