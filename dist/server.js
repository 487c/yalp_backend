"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing module
//ts-ignore
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const storage = multer_1.default.diskStorage({
    destination: "./tmp",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "pdf_" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const port = 3000;
/** Anlegen, Abrufen Skripte und Übersicht von Skripten */
app.post("/script", upload.single("pdfFile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(500).send("Missing PDF");
            return;
        }
        const pdfFilePath = req.file.path;
        res.status(200).send("PDF printed successfully.");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error printing PDF.");
    }
}));
app.get("/scripts", (req, res) => {
    res.send("Gettings scripts for course");
});
app.get("/script", (req, res) => {
    res.send("Getting a script.");
});
/** Anlegen, Abrufen Skripte und Übersicht von Karten*/
app.get("/cards", (req, res) => {
    res.send("Getting cards for course");
});
app.post("/card", (req, res) => {
    res.send("Writing a card for course");
});
/** Anlegen, Abrufen Skripte und Übersicht von Kursen*/
app.get("/courses", (req, res) => {
    res.send("Getting courses for user");
});
app.post("/course", (req, res) => {
    res.send("Creating a course for user.");
});
/** Anlegen, Abrufen Skripte und Übersicht von */
app.get("/courses", (req, res) => {
    res.send("Getting courses for user");
});
app.post("/course", (req, res) => {
    res.send("Creating a course for user.");
});
// Server setup
app.listen(port, () => {
    console.log("The application is listening " + "on port http://localhost:" + port);
});
