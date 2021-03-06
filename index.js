const express = require("express");

// Imports
const upload = require("./routes/upload");
const cors = require("cors");
const dotenv = require("dotenv");
var fileupload = require("express-fileupload");
// env variables from .env file
dotenv.config();

// Initialize The Mongoose
//--------------------------------------------
const mongoose = require("mongoose");
const uri = process.env.MONGO_URL;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
	console.log("mongo DB success");
});
//--------------------------------------------
// Initialize the app
const app = express();
app.use(fileupload());
// Port

const port = process.env.PORT || 5000;
// Middleware to get data from body
app.use(express.json());
// TO Send Static pages
app.use(express.static(__dirname + "/public"));

// Cross Origin Resource Sharing
app.use(cors());
// Routes
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index/index.html");
});
app.use("/upload", upload);

// Express Listen
app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
