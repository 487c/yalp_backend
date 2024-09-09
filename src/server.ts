// Importing module
//ts-ignore
import express from "express";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: "./tmp",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "pdf_" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const port: Number = 3000;

/** Anlegen, Abrufen Skripte und Übersicht von Skripten */
app.post("/script", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(500).send("Missing PDF");
      return;
    }
    const pdfFilePath = req.file.path;

    res.status(200).send("PDF printed successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error printing PDF.");
  }
});
app.get("/scripts", (req: any, res: any) => {
  res.send("Gettings scripts for course");
});

app.get("/script", (req: any, res: any) => {
  res.send("Getting a script.");
});

/** Anlegen, Abrufen Skripte und Übersicht von Karten*/
app.get("/cards", (req: any, res: any) => {
  res.send("Getting cards for course");
});

app.post("/card", (req: any, res: any) => {
  res.send("Writing a card for course");
});


/** Anlegen, Abrufen Skripte und Übersicht von Kursen*/
app.get("/courses",  (req: any, res: any) => {
  res.send("Getting courses for user");
});
app.post("/course", (req: any, res: any) => {
  res.send("Creating a course for user.");
});

/** Anlegen, Abrufen Skripte und Übersicht von */
app.get("/courses",  (req: any, res: any) => {
  res.send("Getting courses for user");
});
app.post("/course", (req: any, res: any) => {
  res.send("Creating a course for user.");
});

// Server setup
app.listen(port, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + port
  );
});
