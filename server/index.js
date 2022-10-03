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
const Report = require("./models/Report");
const { query } = require("express");
const cookies = new Cookies();
const dayString = require('./dayString');
const timeString = require('./timeString');
const AdminMsg = require("./models/MsgsFromAdmin");
const Tea = require("./models/Tea");
const SERVER_DATE = new Date();
const DAY_OF_WEEK = dayString(SERVER_DATE);
const TIME_OF_DAY = timeString(SERVER_DATE, 11);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

dbConnect();

// app.get('/numbers', auth, async (req,res) => {
//   res.send('working')
// });

app.get('/', async (req, res) => {
  res.send({
    message: 'food-loaded',
    date: SERVER_DATE.toString(),
    day: DAY_OF_WEEK,
    time: TIME_OF_DAY,
    target: await Food.find({ [`${DAY_OF_WEEK}.${TIME_OF_DAY}`] : true })
  });
});

app.get('/getFood', async (req, res) => {
  let sentReport = await Food.find({ [`${DAY_OF_WEEK}.${TIME_OF_DAY}`] : true })
    .then((sendingTheseNums) => {
      res.send({
        message: 'food-loaded',
        date: SERVER_DATE.toString(),
        day: DAY_OF_WEEK,
        time: TIME_OF_DAY,
        target: sendingTheseNums
      });
    })
});


app.get('/getMorningFood', async (req, res) => {
  let sentReport = await Food.find({ [`${DAY_OF_WEEK}.morning`] : true })
    .then((sendingTheseNums) => {
      res.send({
        message: 'food-loaded',
        date: SERVER_DATE.toString(),
        day: DAY_OF_WEEK,
        time: 'morning',
        target: sendingTheseNums
      });
    })
});

app.get('/getAfternoonFood', async (req, res) => {
  let sentReport = await Food.find({ [`${DAY_OF_WEEK}.afternoon`] : true })
    .then((sendingTheseNums) => {
      res.send({
        message: 'food-loaded',
        date: SERVER_DATE.toString(),
        day: DAY_OF_WEEK,
        time: 'afternoon',
        target: sendingTheseNums
      });
    })
});

app.post('/createTea', async(req, res) => {
  const request = req.body;

  await Tea.create({
    id: request.id,
    name: request.name,
    meetsContainer: request.meetsContainer,
    meetsBackupBag: request.meetsBackupBag,
    amountInBackupBag: request.amountInBackupBag,
    amountInBackupContainer: request.amountInBackupContainer
  }).then((success) => {
    res.send({
      success: true,
      message: 'Tea created',
      target: success
    })
  }).catch((err) => {
    res.send({
      success: false,
      message: 'This tea already exists',
      target: err
    })
  })
});


app.post('/sendNumbers', async (req, res) => {
  const request = req.body;
  const numbers = request.numbers;
  const reportedBy = request.reportedBy;
  const dateReported = request.dateReported;
  const timeReported = request.timeReported;

    await Report.create({
      date: dateReported,
      time: timeReported,
      user: reportedBy,
      numsReported: numbers
    }).then((affirm) => {
      console.log('Food reported submitted', affirm)
      res.send({
        success: true, 
        affirm
      })
    }).catch((err) => {
      console.log('Food could not be submitted', err)
      res.send({
        success: false,
        err
      })
    });
});

app.get('/getReports', async (req, response) => {
  const reports = await Report.find({}, {}, {returnOriginal: false}).then((res) => {
    response.send({
      success: true,
      message: 'reports-loaded',
      target: res
    })
  }).catch((err) => {
    response.send({
      success: false,
      message: 'reports-not-loaded',
      target: err
    })
  })
});

app.post('/sendAdminMsg', async (REQUEST, RESPONSE) =>  {
  const data = REQUEST.body;

  await AdminMsg.findByIdAndUpdate({ _id: '63391b9dc62e4902b0981ebd' }, { msg: data.msg, username: data.username, firstName: data.firstName }, {returnOriginal: false})
    .then((results) => {
      console.log(results)
    })
});

app.get('/getAdminMsg', async (REQUEST, RESPONSE) =>  {
  const data = REQUEST.body;

  const msg = await AdminMsg.findById({ _id: '63391b9dc62e4902b0981ebd' })

  RESPONSE.send({ msg: msg.msg, firstName: msg.firstName, username: msg.username })
});

app.post('/deleteReport', async (request, res) => {
  const data = request.body;

  await Report.deleteOne({ date: data.date, time: data.time, numsReported: data.numsReported }, { returnOriginal: false } )
    .then((success) => {
      res.send({
        success: true, 
        response: success
      })
    }).catch((error) => {
      res.send({
        success: false,
        response: error
      })
    });
});

app.get('/removeFromAllFood', async (req, response) => {

  const query = req.body.query;
  console.log(query);

  await Food.updateMany({}, { $unset: query })
    .then((res) => {
      response.send({
        message: 'Updated',
        res
       });
    })
    .catch((err) => {
      response.send({
        message: 'Someting went wrong',
        err
      })
    })
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
                role: user.role,
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
                          role: user.role,
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
});

app.post('/createFood', async (req, res) => {
      const data = req.body;
  
      await Food.create({
        id: data.id,
        name: data.name,
        vendor: data.vendor,
        sunday: data.sunday,
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        positions: data.positions,
        rotating: data.rotating
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

    await Food.updateMany(query, changeThis, { returnOriginal: false }).then((results) => {
      res.send({success: true, message: 'All items have been updated!', results})
    }).catch((err) => {
      res.send({success: false, message: 'Could not update', err})
    })
});

app.get('/rotating', async (request, response) => {
  await Food.find({ rotating: true }).then((rez) => {
    response.send({success: true, target: rez})
  }).catch((err) => {
    response.send({success: false, target: err})
  })
});

app.get("/auth", auth, async (request, response) => {

});


app.listen(PORT, () => {
    console.log(`Server is connected to port ${PORT}`)
});