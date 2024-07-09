import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    DPI: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pass: {
        type: String,
        required: true,
    },
    accounts: [{
   
    }],
    role: {
        type: String,
        enum: ['ADMIN', 'CLIENT', 'ENTERPRISE'],
        default: "CLIENT"
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    jobName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

export default model("User", UserSchema);