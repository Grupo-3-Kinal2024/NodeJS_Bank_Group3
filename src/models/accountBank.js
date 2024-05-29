import { Schema, model } from 'mongoose';

const AccountBankSchema = new Schema({
    numberAccount: {
        type: Number,
        require: true,
        unique: true
    },
    salary: {
        type: Number,
        require: true,
    },
    credit: {
        type: Number,
        require: true,
    },
    status: {
        type: Boolean,
        default: true
    }
})

export default model("account", AccountBankSchema)
