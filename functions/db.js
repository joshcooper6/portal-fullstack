const Mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
    try {
       await Mongoose.connect(
            process.env.MONGO_DB,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }
        ).then(() => {
            console.log('Connected to database successfully!')
        }).catch((err) => {
            console.log('Cannot connect to database.');
        })
    } catch (err) {
        console.log('DB ERROR:', err)
    }
}

module.exports = dbConnect;