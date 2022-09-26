const dbConnect = require("./db");
const express = require("express");
const app = express();
const cors = require('cors');
let PORT = process.env.PORT || 5000; 
const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const auth = require('./auth');
const Cookies = require('universal-cookie');
const CookieSession = require('./models/CookieSession');
const cookies = new Cookies();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

dbConnect();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

app.post('/register', async (req, res) => {
    const data = req.body;

    await bcrypt.hash(data.password, 10)
        .then((encryptedPw) => {
            const user = new User({
                username: data.username,
                password: encryptedPw
            });

            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
          );

            user.save().then((result) => {
              res.send({
                success: true,
                message: 'user-created',
                user: result,
                token
              });

            }).catch((error) => {
              res.send({
                message: "cannot-create-user",
                error,
              });
            });

        })
        .catch((e) => {
            res.status(500).send('Password not hashed successfully.')
        })
});


app.post("/login", async (request, response) => {
    await User.findOne({ username: request.body.username })
        .then((user) => {
            bcrypt.compare(request.body.password, user.password)
                .then((passwordValidated) => {
                    if (!passwordValidated) {
                        return response.send({
                            message: "incorrect-password",
                            error,
                          });
                    };

                    const token = jwt.sign(
                        {
                          userId: user._id,
                          username: user.username,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );

                    response.send({
                        success: true,
                        username: user.username,
                        token,
                    });    

                })
                .catch((er) => {
                    response.send({
                        message: "invalid-information",
                        er,
                      });
                });
        })
        .catch((er) => {
            response.send({
                message: "user-not-found",
                er
            })
        }) 
});

app.get("/auth", auth, async (request, response) => {

});
  

app.listen(PORT, () => {
    console.log(`Server is connected to port ${PORT}`)
});