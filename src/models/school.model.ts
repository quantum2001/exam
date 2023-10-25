import { Schema, model } from "mongoose";

const schoolSchema = new Schema({
    name: {
        type: String,
        required: [true, "school name required"]
    },
    address: {
        type: String,
        required: [true, "address required"]
    },
    username: {
        type: String,
        required: [true, "username required"]
    },
    logo: String,
    exam_limit: {
        type: Number,
        default: 0
    },
    is_disabled: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Number,
        default: Date.now(),
        required: true
    },
    password: {
        type: String,
        required: [true, "password required"]
    },
    updated_at: {
        type: Number,
        required: true
    },
})

const Model = model("School", schoolSchema);

export default Model;
