const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const connection = require("./db");
const path = require("path");
const app = express();

connection();
app.use(express.static(path.join("./public")));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", require("./routes/userRouter"));
app.use("/api/types", require("./routes/typeRouter"));
app.use("/api/items", require("./routes/itemRouter"));

// Serve React build files
app.use(express.static(path.join(__dirname, "./build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});
// // API Routes Ends
// // 404 Handler
// app.use((req, res, next) => {
//   res.status(404).json({ status: "fail", message: "Route not found" });
// });

// // Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ status: "error", message: "Something went wrong" });
// });

app.listen("8000", () => {
  console.log("server is running on port 8000");
});
