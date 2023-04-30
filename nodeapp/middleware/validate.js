function validate(req, res, next)
{
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let numberFormat = /^[^0-9]+$/;
    // let  regex = /^[^\r\n0-9]+[1-9][0-9]*$/

    if(req.body.age > 0 && req.body.fullname.length > 0 && format.test(req.body.fullname) == false && numberFormat.test(req.body.fullname))
    {
        next()
    }
    else if(req.body.age < 0)
    {
        res.status(400).send("Nguoi am")
    }
    else if(req.body.fullname.length < 0)
    {
        res.status(400).send("Khong ten")
    }
    else
    {
        res.status(400).send("Sai dinh dang")
    }
}
function validateRegister(req, res, next)
{
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let numberFormat = /^[^0-9]+$/;
    let emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // let  regex = /^[^\r\n0-9]+[1-9][0-9]*$/

    // if(req.body.age > 0 && req.body.username.length >= 3 && req.body.name.length >=2 && format.test(req.body.fullname) == false && numberFormat.test(req.body.fullname) && req.body.password.length >= 3 && emailFormat.test(req.body.email))
    // {
        
    // }
    if(req.body.username.length < 3){
        return res.status(400).json({
            message: "Username ngan"
        })
    }
    else if(req.body.age < 0)
    {
        return res.status(400).send("Khong duoc de gia tri am")
    }
    else if(req.body.name.length < 2)
    {
        return res.status(400).send("Ten qua ngan")
    }
    else if(req.body.password.length < 2)
    {
        return res.status(400).send("Password qua ngan")
    }
    else if(emailFormat.test(req.body.email) == false)
    {
        return res.status(400).send("Sai dinh dang email")
    }
    else if(format.test(req.body.name) && !numberFormat.test(req.body.name))
    {
        return res.status(400).send("Sai dinh dang ten")
    }
    next()
}
module.exports = { 
    validate,
    validateRegister
}
