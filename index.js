const express = require("express");
const http = require("http");
const cors = require("cors"); // Import the cors middleware
const dotenv = require("dotenv");
const compression = require("compression");
const db = require("./config/dbconnection");

const app = express();
dotenv.config();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(compression({ level: 6 }));
db.connect();

// Use the cors middleware to enable cross-origin requests
app.use(cors({ origin: "*" }));

const UserRouter = require("./routes/userroutes");

app.use("/api/user", UserRouter);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
