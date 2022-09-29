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
const Food = require("./models/FoodInventory");
const { query } = require("express");
const cookies = new Cookies();
const dayString = require('./dayString');
const timeString = require('./timeString');
const SERVER_DATE = new Date();
const DAY_OF_WEEK = dayString(SERVER_DATE);
const TIME_OF_DAY = timeString(SERVER_DATE);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

dbConnect();

app.get('/', async (req, res) => {
  res.send({
    message: 'food-loaded',
    date: SERVER_DATE.toString(),
    day: DAY_OF_WEEK,
    time: TIME_OF_DAY,
    food: await Food.find({ [`${DAY_OF_WEEK}.${TIME_OF_DAY}`] : true })
  });
});

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
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
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
                          email: user.email,
                          firstName: user.firstName,
                          lastName: user.lastName
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

app.get('/foodInventory', async (request, response) => {
  response.send({connect: true, message: 'time to send your food!'});
  console.log(request.body);
});

app.post('/changeUserInfo', async (req, response) => {
  const tgt = req.body.tgt;
  const update = req.body.update;

  await User.findOneAndUpdate(tgt, update, { returnOriginal: false }).then((res) => {
    response.send({success: true, message: 'Updated successfully!', res})
  }).catch((err) => {
    console.log('ERROR AT AWAIT', err)
    response.send({success: false, message: 'Something went wrong', err})
  })
  
  console.log(req.body, tgt, update)
});

app.post('/foodInventory', async (request, response) => {
  const data = request.body;
  response.send({message: 'Use /createFood or /updateFood instead.'});

  // await Food.create({
  //   id: data.id,
  //   name: data.name,
  //   vendor: data.vendor,
  //   group: data.group
  // }).then(() => {
  //   response.send({success: true, message: 'Food has been added to DB!'})
  // }).catch((err) => {
  //   response.send({success: false, message: 'It looks like this item exists or the data has not been filled out.', err})
  // })

  // await Food.updateMany({ vendor: 'crafted' }, { afternoon: false }).then(() => {
  //   response.send({ success: true, message: 'All items have been updated!'})
  // }).catch((err) => {
  //   response.send({success: false, message: 'Could not update', err})
  // })
});

app.post('/createFood', async (req, res) => {
      const data = req.body;
  
      await Food.create({
      id: data.id,
      name: data.name,
      vendor: data.vendor,
      group: data.group
    }).then(() => {
      res.send({success: true, message: 'Food has been added to DB!'})
    }).catch((err) => {
      res.send({success: false, message: 'It looks like this item exists or the data has not been filled out.', err})
    })
});

app.post('/updateFood', async (req, res) => {
    const query = req.body.query;
    const changeThis = req.body.changeThis;
    console.log(query, changeThis);

    await Food.updateMany(query, changeThis).then(() => {
      res.send({success: true, message: 'All items have been updated!'})
    }).catch((err) => {
      res.send({success: false, message: 'Could not update', err})
    })

});

app.get("/auth", auth, async (request, response) => {

});


app.listen(PORT, () => {
    console.log(`Server is connected to port ${PORT}`)
});