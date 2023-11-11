"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'class name required'],
    },
    school_id: {
        type: String,
        required: [true, 'school id required'],
    },
    created_at: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    updated_at: {
        type: Number,
        default: Date.now(),
        required: true,
    },
});
const Model = (0, mongoose_1.model)('Class', classSchema);
exports.default = Model;
//# sourceMappingURL=class.model.js.map