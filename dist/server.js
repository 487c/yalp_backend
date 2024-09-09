"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing module
//ts-ignore
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/cards", (req, res) => {
    res.send("Welcome to typescript backend!");
});
app.post("/script", (req, res) => {
    res.send("Posting a page");
});
// Server setup
app.listen(port, () => {
    console.log("The application is listening " + "on port http://localhost:" + port);
});
