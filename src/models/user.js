import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    DPI: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
    accounts: [{
   
    }],
    role: {
        type: String,
        enum: ['ADMIN', 'CLIENT'],
        default: "CLIENT"
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    jobName: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
});

export default model("user", UserSchema);