const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const connection = require("./db");
const app = express();

connection();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/users", require("./routes/userRouter"));
app.use("/api/v1/types", require("./routes/typeRouter"));
app.use("/api/v1/items", require("./routes/itemRouter"));
app.listen("8000", () => {
  console.log("server is running on port 8000");
});
