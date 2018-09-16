const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants');

module.exports = {
    generateToken,
    verifyToken,
};

function generateToken(user) {
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        role: user.role,
    }, SECRET_KEY, { expiresIn: '3h' });
    return token;
}

function verifyToken(token, callback) {
    jwt.verify(token, SECRET_KEY, callback);
}
