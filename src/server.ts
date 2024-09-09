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

app.get("/cards", (req: any, res: any) => {
  res.send("Posting a page");
});

// Server setup
app.listen(port, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + port
  );
});
