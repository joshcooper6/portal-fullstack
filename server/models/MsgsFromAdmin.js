const Mongoose = require('mongoose')
const AdminMsgSchema = new Mongoose.Schema({
    msg: {
        type: String,
        unique: [true, "Session exists"],
        required: [true, "Please provide valid user info to validate."],
    },
    username: {
        type: String,
        required: [true, "Please provide a username!"],
    },
    firstName: {
        type: String,
        required: [true, 'Please enter first name!']
    }
}, 
{
    timestamps: true
})

const AdminMsg = Mongoose.model("AdminMsg", AdminMsgSchema)
module.exports = AdminMsg     