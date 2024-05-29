import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
    numberAccount: {
        type: Number,
        require: true
    },
    DPIFavorite: {
        type: Number,
        require: true
    },
    DPIPersonal: {
        type: Number,
        require: true
    },
    alias: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

export default model("favorite", FavoriteSchema);