import { Timestamp } from 'mongodb';
import { Schema, model } from 'mongoose';

const AccountSchema = new Schema({
    numberAccount: {
        type: Number,
        require: true,
        unique: true,
        trim: true
    },
    salary: {
        type: Number,
        require: true,
        trim: true
    },
    credit: {
        type: Number,
        require: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Account", AccountSchema)