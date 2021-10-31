const { application } = require("express");
const express = require("express");
const multer = require("multer");
let path = require("path");
const Songs = require("../models/songs");
const router = express.Router();

// Basic Page For Uploading songs
router.get("/", (req, res) => {
	res.sendFile("/upload/index.js");
});

// multer config
const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.mimetype === "audio/mpeg") {
			cb(null, "./songs");
		} else {
			cb(null, "./songCover");
		}
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	},
});
const upload = multer({ storage: fileStorageEngine });

router.post("/addSong", upload.array("files", 2), async (req, res) => {
	let songUrl = "";
	let CoverUrl = "";
	req.files.forEach((element) => {
		if (element.mimetype === "audio/mpeg") {
			songUrl = process.env.url + "upload/getSongs/" + element.filename;
		} else {
			CoverUrl = process.env.url + "upload/getCover/" + element.filename;
		}
	});

	let song = new Songs({
		title: req.body.title,
		artist: req.body.artist,
		SongUrl: songUrl,
		cover: CoverUrl,
	});
	song.save().then(() => {
		res.json({
			message: "Song Uploaded Successfully",
			song,
		});
	});
});
router.get("/getSongs/:filename", (req, res) => {
	res.sendFile(path.join(__dirname, "../songs/" + req.params.filename));
});

router.get("/getCover/:filename", (req, res) => {
	res.sendFile(path.join(__dirname, "../songCover/" + req.params.filename));
});
module.exports = router;
