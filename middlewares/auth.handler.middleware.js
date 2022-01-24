
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env['JWT_SECRET'];
// console.log(require('crypto').randomBytes(256).toString('base64'));


const authVerify = (req, res, next) => {

   const token = req.headers.authorization;

  //  const token = req.headers.authorization.split(" ")[1];
  //  for bearer.

  if (token == null ) return res.status(401).json({message: "Unauthorised access, please add the token"})
   
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: "Invalid Token" })
  }
}

module.exports = { authVerify };