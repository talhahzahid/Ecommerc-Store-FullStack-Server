
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    productImgUrl: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Electronics', 'Accessories', 'Home', 'Beauty', 'Sports']
    }

}, { timestamps: true })

export default mongoose.model('products', productSchema)