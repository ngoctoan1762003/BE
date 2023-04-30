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