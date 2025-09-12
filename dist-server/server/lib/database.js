"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.db = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
// Database connection with error handling
let connection;
let db;
try {
    if (typeof process !== 'undefined' && process.env.DATABASE_URL) {
        exports.connection = connection = (0, postgres_1.default)(process.env.DATABASE_URL);
        exports.db = db = (0, postgres_js_1.drizzle)(connection);
        console.log('Database connection established successfully');
    }
    else {
        console.error('DATABASE_URL not available');
    }
}
catch (error) {
    console.error('Database connection failed:', error);
}
