import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please add a text value"]
    }
},{timestamps: true});

export default mongoose.model("Goal", goalSchema);