import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    type: {
        type: String,
        enum: ['PRODUCT', 'SERVICE'],
    },
    name: {
        type: String,
        require: true
    },
    enterprice: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Product", ProductSchema);