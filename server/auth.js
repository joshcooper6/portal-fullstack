const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        console.log('TOKEN', token)
        const decodedToken = await jwt.verify(
            token,
            "RANDOM-TOKEN"
          );
          const user = await decodedToken;
          console.log('USER', user)
          next();
          res.send({ success: true, user: user })
    } catch (error) {
        res.status(401).send({
            error: error,
          });
    }
};

module.exports = auth