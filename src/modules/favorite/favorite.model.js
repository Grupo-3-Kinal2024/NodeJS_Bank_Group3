import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
    numberAccount: {
        type: Number,
        require: true,
        trim: true
    },
    DPIFavorite: {
        type: Number,
        require: true,
        trim: true
    },
    DPIPersonal: {
        type: Number,
        require: true,
        trim: true
    },
    alias: {
        type: String,
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

export default model("Favorite", FavoriteSchema);