const Mongoose = require('mongoose')
const TeaReportSchema = new Mongoose.Schema({
    date: {
        type: String,
        required: [true, 'Please enter todays date']
    },
    time: {
        type: String,
        required: [true, 'Please enter current time']
    },
    user: {
        type: String,
        required: [true, 'Please enter user name']
    },
    teaResults: {
        type: Array,
        default: [],
        required: [true, 'Please send the numbers']
    },
    needed: {
        type: Array,
        default: []
    },
    nextWeek: {
        type: Array,
        default: []
    },
    msgRendered: {
        type: String,
        default: ""
    }
}, 
{
    timestamps: true
})

const TeaReport = Mongoose.model("TeaReport", TeaReportSchema)
module.exports = TeaReport     