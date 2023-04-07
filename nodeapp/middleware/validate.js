// const validate = function (err, req, res, next)
// {
//     var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
//     console.log("validate")
//     console.log(format.test(req.body.fullname))

//     if(req.body.age > 0 && req.body.fullname > 0 && format.test(req.body.fullname) == false)
//     {
//         next()
//     }
//     else
//     {
//         res.status(400).send("Error")
//     }
// }

module.exports = function (req, res, next)
{
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var numberFormat = /^[^0-9]+$/;

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
