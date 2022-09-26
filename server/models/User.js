const Mongoose = require('mongoose')
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        unique: [true, "User Exist"],
        required: [true, "Please provide a user!"],
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please provide a password!"],
    },
    role: {
        type: String, 
        default: "Basic",
        required: true
    },
    firstName: {
        type: String, 
        required: false,
        default: ""
    },
    lastName: {
        type: String, 
        required: false,
        default: ""
    },
    email: {
        type: String, 
        required: false,
        default: ""
    },

}, 
{
    timestamps: true
})

const User = Mongoose.model("User", UserSchema)
module.exports = User     