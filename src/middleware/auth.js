const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token de autorização não fornecido.' });
    }

    const [bearer, apiToken] = token.split(' ');

    if (bearer !== 'Bearer' || apiToken !== process.env.API_TOKEN) {
        return res.status(401).json({ success: false, message: 'Acesso não autorizado.' });
    }

    next();
};

module.exports = authenticate;
