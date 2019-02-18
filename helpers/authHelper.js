module.exports = function (config) {
    let self = this;
    const jwt = require('jsonwebtoken');

    this.authenticateToken = async (token) => {

        try {
            // TODO: Just some basic auth here, ideally would use
            // a NODE_ENV param or a "secret manager" service for auth
            // and put some expiration constraints
            let decoded = await jwt.verify(token, config.api.secretKey);
            return decoded.user == 'clubSpark';
        } catch (err) {
            console.log(err);
            return false;
        }

    }

    return self;
}