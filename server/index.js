const dbConnect = require("./db");
const express = require("express");
const app = express();
const cors = require('cors');
let PORT = process.env.PORT || 5000; 
const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const auth = require('./auth');
const Food = require("./models/FoodInventory");
const Report = require("./models/Report");
const dayString = require('./dayString');
const path = require('path');
const timeString = require('./timeString');
const Tea = require("./models/Tea");
const TeaReport = require("./models/TeaReport");
const SERVER_DATE = new Date();
const DAY_OF_WEEK = dayString(SERVER_DATE);
const TIME_OF_DAY = timeString(SERVER_DATE, 11);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dbConnect();

app.get('/', async (req, res) => {
  res.send({message: 'working'})
});

app.get('/getAll', async (req, res) => {
  await Food.find({})
    .then((numbers) => {
      res.send({target: numbers})
      console.log(numbers)
    })
    .catch((err) => {
      res.send({err})
    })
});

app.get('/getTea', async(req, res) => {
 await Tea.find({})
    .then((success) => {
      res.send({
        success: true,
        message: 'All tea has been loaded',
        target: success
      })
    }).catch((err) => {
      res.send({
        success: false,
        message: 'Something went wrong loading all tea',
        target: err
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

app.post('/reportTea',  async(req, res) => {
  const request = req.body;

  const query = { name: request.name }
  const target = {
    meetsContainer: request.meetsContainer,
    meetsBackupBag: request.meetsBackupBag,
  };

  await Tea.findOneAndUpdate(query, target, { returnOriginal: false })
    .then((success) => {
      res.send({
        success: true,
        message: 'Tea has been updated',
        target: success
      })
    }).catch((err) => {
      res.send({
        success: false,
        message: 'Something went wrong adding tea',
        target: err
      })
    })
});

app.post('/finalReport', async(req,res) => {
  const request = req.body;

  await TeaReport.create({
    date: SERVER_DATE,
    time: SERVER_DATE.toLocaleTimeString(),
    user: request.user,
    teaResults: request.teaResults,
    needed: request.needed,
    nextWeek: request.nextWeek,
    msgRendered: request.msgRendered
  })
  .then((success) => {
    res.send({
      success: true,
      message: 'Tea report has been created!',
      target: success
    })})
    .catch((err) => {
      res.send({
        success: false,
        message: 'Something went wrong reporting tea',
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
        rotating: data.rotating,
        currentTotal: 0
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

app.post('/updateFoodItem', async (req, res) => {
  const query = req.body.query;
  const changeThis = req.body.changeThis;
  console.log(query, changeThis);

  await Food.findOneAndUpdate(query, changeThis, { returnOriginal: false }).then((results) => {
    res.send({success: true, message: 'All items have been updated!', results})
  }).catch((err) => {
    res.send({success: false, message: 'Could not update', err})
  })
});

app.post('/deleteFoodItem', async (req, res) => {
  const query = req.body.query;
  console.log(query);

  await Food.findOneAndDelete(query, { returnOriginal: false }).then((results) => {
    res.send({success: true, message: 'All items have been deleted!', results})
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
