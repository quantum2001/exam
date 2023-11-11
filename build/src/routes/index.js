"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
const admin_routes_1 = __importDefault(require("./admin.routes"));
const student_routes_1 = __importDefault(require("./student.routes"));
const school_routes_1 = __importDefault(require("./school.routes"));
const v1Router = (0, express_1.Router)();
exports.v1Router = v1Router;
v1Router.use('/admin', admin_routes_1.default);
v1Router.use('/student', student_routes_1.default);
v1Router.use('/school', school_routes_1.default);
//# sourceMappingURL=index.js.map