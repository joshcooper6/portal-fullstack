const Mongoose = require('mongoose')
const SessionSchema = new Mongoose.Schema({
    sessiontoken: {
        type: String,
        unique: [true, "Session exists"],
        required: [true, "Please provide valid user info to validate."],
    },
    username: {
        type: String,
        required: [true, "Please provide a username!"],
    }
}, 
{
    timestamps: true
})

const NewSession = Mongoose.model("NewSession", SessionSchema)
module.exports = NewSession     