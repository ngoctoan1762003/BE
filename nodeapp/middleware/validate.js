const cacheService = require('../helper/cache.service');
const connnection = require('../database/connection');
const jwt = require('jsonwebtoken')

function validate(req, res, next)
{
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let numberFormat = /^[^0-9]+$/;
    // let  regex = /^[^\r\n0-9]+[1-9][0-9]*$/

    if(req.body.age > 0 && req.body.name.length > 0 && format.test(req.body.name) == false && numberFormat.test(req.body.name))
    {
        next()
    }
    else if(req.body.age < 0)
    {
        res.status(400).send("Nguoi am")
    }
    else if(req.body.name.length < 0)
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

    // if(req.body.age > 0 && req.body.username.length >= 3 && req.body.name.length >=2 && format.test(req.body.name) == false && numberFormat.test(req.body.name) && req.body.password.length >= 3 && emailFormat.test(req.body.email))
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

const canAccessBy = (...allowedPermissions) => {
    return async (req, res, next) => {
      const authHeader = req.headers['authorization'];
  
      if (!authHeader) {
        return res.sendStatus(401);
      }
  
      const token = authHeader;
  
      /*await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.sendStatus(401); // invalid token
        }
  
        const userCache = await cacheService.getOneUser(decoded.id);
        
        if (!userCache || !userCache.permissions) {
          return res.sendStatus(403); // unauthorized
        }
  
        const permissionArray = [...allowedPermissions];
        const result = userCache.permissions.map((item) => permissionArray.includes(item)).find((val) => val === true);
  
        if (!result) {
          return res.sendStatus(403);
        }
  
        next();
      });*/

    const isValidToken = await jwt.verify(token, process.env.JWT_SECRET);

    const id = isValidToken.id;
    let permissionArray = allowedPermissions;
    let permissionPossible = [];
    let isAuthorized = true

    connnection.query('SELECT DISTINCT PermissionType FROM permission JOIN role_permission ON permission.PermissionID = role_permission.PermissionID\
        JOIN role ON role.RoleID = role_permission.RoleID JOIN user_role ON user_role.RoleID = role.RoleID JOIN users on users.id = user_role.UserID WHERE users.id = ?', [id], 
        (err, result) => {
            let permission = Object.values(JSON.parse(JSON.stringify(result)))
            permission.forEach(per => {
                type = per.PermissionType
                permissionPossible.push(type)
            })

            console.log(permissionPossible);
            console.log(permissionArray)

            permissionArray.forEach(per => {
                if(!permissionPossible.includes(per))
                    isAuthorized = false
            })
            if(isAuthorized) 
                next();
            else {
                return res.status(500).json({
                    message: "unauthorized"
                })
            };
        });

  }};

Object.freeze(cacheService);
module.exports = { 
    validate,
    validateRegister,
    canAccessBy
}
