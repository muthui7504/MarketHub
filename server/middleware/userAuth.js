import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies.token; // Token from the request's cookies

    if (!token) {
        return res.json({ success: false, message: 'Not authorized. Please login and try again.' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id }; // Set user object with id property
        } else {
            return res.json({ success: false, message: 'Login not authorized. Try again.' });
        }

        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default userAuth;
