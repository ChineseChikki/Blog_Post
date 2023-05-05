const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    //check if the Token exist
    if (token) {
      //verifies the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      //Attach the decoded data to the res.locals object
      console.log(decoded);
      res.locals.id = decoded.id;
      // send the request to the next middleware
      next();
    } else {
      return res.status(404).json({ success: false, message: "No Token" });
    }  
  } catch (error) {
     if (error.name === "JsonWebTokenError") {
      res.status(403).json({ success: false, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired" });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  }
}