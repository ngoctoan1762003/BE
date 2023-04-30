const crypto = require('crypto');

const secret = 'secret';

function hashPassword(input)
{
    const hashObject = crypto.createHash('sha512');
    const hasedPassword = hashObject
                        .update(input)
                        .digest('hex');
    
    return hasedPassword;
}

//Hash with salt
function hashPasswordWithSalt(input)
{
    const salt = crypto.randomBytes(16).toString('hex');
    const hasedPassword = crypto
                        .pbkdf2Sync(input, salt, 1000, 64, 'sha512')
                        .toString('hex');

    return hasedPassword;
}

//SYMETRIC: USE one SECRET key
//Quy luật encrypt:
    //1. Append SECRET key vào cuối chuỗi
    //2. Đảo ngược chuỗi
function reverseString(str)
{
    let splitString = str.split('');

    splitString = splitString.reverse();

    return splitString.join('');
}

function encrypt(input)
{
    const inputWithPadding = input + secret; //Append
    const reversedString = reverseString(inputWithPadding)

    return reversedString
}

function decrypt(input)
{
    //reverse string
    const reversedString = reverseString(input);
    
    //remove secret key to get plain text
    const output = reversedString
            .substring(0, reversedString.length - secret.length);

    return output;
}

//Assymetric
const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});

function encrypt(plainText) 
{
    const cipherText = crypto.publicEncrypt({
        key: publicKey,
        oaepHash: 'sha256',
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(plainText))
    .toString('base64')
    
    //return cipherText
    return cipherText
}

function decrypt(cipherText)
{
    const plainText = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, Buffer.from(cipherText, 'base64')).toString();
    
    //return plainText
    return plainText;
}


const plainPassword = 'thinh12345'
const cipherText = encrypt(plainPassword)
const decryptedText = decrypt(cipherText)

console.log({
    plainText: plainPassword,
    cipherText: cipherText,
    decryptedText: decryptedText
})





// const cipherText = encrypt(plainPassword)

// const decryptedText = decrypt(cipherText)

// console.log({
//     plainText: plainPassword,
//     cipherText: cipherText,
//     decryptedText: decryptedText
// })



const iteration = 10
for(let i=0; i<iteration; i++)
{
    hashSalt = hashPasswordWithSalt(plainPassword);
    hashAgain = hashPassword(hashSalt)
    console.log({
        hashSalt,
        hashAgain
    })
}




// const hashedPassword = hashPassword(plainPassword)
// console.log({
//     plainPassword,
//     hashedPassword,
// })