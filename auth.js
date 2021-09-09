const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
    //console.log(req.headers);
    //console.log(req.params.id);

  if (!token) {
    return res.status(403).send("A token is required for authentication");//403 for forbidden
  }
  try {
    const decoded = jwt.verify(token,"Sherlock");
    req.user = decoded;
    //console.log(decoded.UserId);
    //console.log(req.params.id);

    if (decoded.UserId==req.params.id){ return next(); }
    else { return res.status(401).json({ message:"Access denied"} ); }// 401 for unauthorised
  } catch (err) {
    return res.status(400).send("Invalid Token"); // 400 for bad request
  }
  return next();
};

module.exports = verifyToken;