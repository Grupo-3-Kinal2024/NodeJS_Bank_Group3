import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
    type: {
        type: String,
        enum: ['TRANSFER', 'CREDIT', "BUY"],
    },
    sourceAccount: {
        type: Number,
        ref: "account",
        require: true
    },
    destinationAccount: {
        type: Number,
        ref: "account",
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        require: true
    },
    enterprise: {
        type: String,
    },
    nit: {
        type: Number
    },
    description: {
        type: String,
        require: true
    },
    process: {
        type: String,
        enum: ["REVISION", "APPROVED", "DISAPPROVED"],
        default: "REVISION"
    },
    status: {
        type: Boolean,
        default: true
    }
})


export default model("transaction", TransactionSchema)