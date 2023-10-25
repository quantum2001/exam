import { Schema, model } from "mongoose";

const classSchema = new Schema({
    name: {
        type: String,
        required: [true, "class name required"]
    },
    school_id: {
        type: String,
        required: [true, "school id required"]
    },
    created_at: {
        type: Number,
        default: Date.now(),
        required: true
    }
})

const Model = model("Class", classSchema);

export default Model;
