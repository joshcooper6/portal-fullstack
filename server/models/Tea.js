const Mongoose = require('mongoose')
const TeaSchema = new Mongoose.Schema({
    id: {
        type: String,
        unique: true, 
        required: [true, 'Please enter an id for this tea']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'Please enter a name for this tea']
    },
    meetsContainer: {
        type: Boolean,
        default: false,
    },
    meetsBackupBag: {
        type: Boolean,
        default: false
    },
    amountInBackupBag: {
        type: String,
        default: ""
    },
    amountInBackupContainer: {
        type: String,
        default: ""
    }
}, 
{
    timestamps: true
})

const Tea = Mongoose.model("Tea", TeaSchema)
module.exports = Tea     