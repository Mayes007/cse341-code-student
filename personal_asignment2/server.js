const express = require("express");
require("dotenv").config();
const { connectDB } = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Single-line route connection
app.use("/contacts", require("./routes/contacts"));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
