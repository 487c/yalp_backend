// Importing module
//ts-ignore
import express from "express";

const app = express();
const port: Number = 3000;

app.get("/cards", (req: any, res: any) => {
  req.
  res.send("Welcome to typescript backend!");
});


app.post("/script", (req: any, res: any) => {
  res.send("Posting a page");
});


// Server setup
app.listen(port, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + port
  );
});
