const Mongoose = require('mongoose')
const ReportSchema = new Mongoose.Schema({
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
    numsReported: {
        type: Array,
        default: [],
        required: [true, 'Please send the numbers']
    }
}, 
{
    timestamps: true
})

const Report = Mongoose.model("Report", ReportSchema)
module.exports = Report     