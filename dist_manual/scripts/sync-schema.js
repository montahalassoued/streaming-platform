"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../data-source"));
async function run() {
    try {
        const ds = await data_source_1.default.initialize();
        console.log("DataSource initialized. Synchronizing schema...");
        await ds.synchronize();
        console.log("Schema synchronized successfully.");
        await ds.destroy();
        process.exit(0);
    }
    catch (err) {
        console.error("Schema synchronization failed:", err);
        process.exit(1);
    }
}
void run();
