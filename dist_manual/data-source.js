"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const srcPath = process.cwd();
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [path_1.default.join(srcPath, "src", "**", "*.entity.{ts,js}")],
    migrations: [path_1.default.join(srcPath, "src", "migrations", "*.{ts,js}")],
});
exports.default = dataSource;
