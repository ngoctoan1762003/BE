

module.exports = function (req, res, next)
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
