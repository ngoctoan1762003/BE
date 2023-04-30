const crypto = require('crypto')

function hashPasswordWithSalt(input)
{
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
                        .pbkdf2Sync(input, salt, 1000, 64, 'sha512')
                        .toString('hex');

    return {
        salt,
        hashedPassword
    };
}

function hashPasswordWithAvailableSalt(input, salt)
{
    const hashedPassword = crypto
                        .pbkdf2Sync(input, salt, 1000, 64, 'sha512')
                        .toString('hex');

    return hashedPassword;
}

module.exports = {
    hashPasswordWithSalt,
    hashPasswordWithAvailableSalt
}