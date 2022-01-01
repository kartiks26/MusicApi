const express = require("express");
const multer = require("multer");
let path = require("path");
const Songs = require("../models/songs");
const router = express.Router();
const fs = require("fs");
const { uploadFile } = require("../firebaseDb");
const { deprecate } = require("util");
const { json } = require("express");

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
const upload = multer({
	storage: fileStorageEngine,
	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

router.post("/addSong", upload.array("files"), async (req, res) => {
	let songUrl = "";
	let CoverUrl = "";

	songUrl = process.env.url + "upload/getSongs/" + req.files[1].filename;

	CoverUrl = process.env.url + "upload/getCover/" + req.files[0].filename;

	let song = new Songs({
		title: req.body.title,
		artist: req.body.artist,
		SongUrl: songUrl,
		cover: CoverUrl,
	});
	song
		.save()
		.then(() => {
			res.json({
				message: "Song Uploaded Successfully",
				song,
			});
		})
		.catch((err) => {
			res.json({
				message: "Error Occured",
				err,
			});
		});
});

// @deprecated
router.post("/addSong", upload.array("files"), async (req, res) => {
	let songUrl = "";
	let CoverUrl = "";

	songUrl = process.env.url + "upload/getSongs/" + req.files[1].filename;

	CoverUrl = process.env.url + "upload/getCover/" + req.files[0].filename;

	let song = new Songs({
		title: req.body.title,
		artist: req.body.artist,
		SongUrl: songUrl,
		cover: CoverUrl,
	});
	song
		.save()
		.then(() => {
			res.json({
				message:
					"Song Uploaded Successfully but try to post data with firebase method",
				song,
			});
		})
		.catch((err) => {
			res.json({
				message: "Error Occured",
				err,
			});
		});
});

router.post("/addSongWithFirebase", async (req, res) => {
	const songData = new Songs({
		title: req.body.title,
		artist: req.body.artist,
		SongUrl: req.body.songUrl,
		cover: req.body.coverUrl,
		userId: req.body.userId,
	});
	songData
		.save()
		.then(() => {
			res.json({
				message: "Song Uploaded Successfully",
				songData,
			});
		})
		.catch((err) => {
			res.json({
				message: "Error Occurred",
				err,
				songData,
			});
		});
});

// To specify Urls into database get that songs and images Routes
//_______________________________________________________________________________________

// Songs Get Call
router.get("/getSongs/:filename", async (req, res) => {
	// try {
	// 	const url = path.join(__dirname, "../songs/");
	// 	res.sendFile(req.params.filename, { root: url }, function (err) {
	// 		if (err) {
	// 			res.status(404).json({
	// 				success: false,
	// 				message: "Song not Found",
	// 			});
	// 		} else {
	// 			console.log("Song Found");
	// 		}
	// 	});
	// } catch (error) {
	// 	res.status(500).json({
	// 		success: false,
	// 		message: "Server Error",
	// 	});
	// }
	res.sendFile(path.join(__dirname, "../songs/", req.params.filename));
});

//Images Get Call
router.get("/getCover/:filename", (req, res) => {
	try {
		res.sendFile(path.join(__dirname, "../songCover/" + req.params.filename)),
			(err) => {
				if (err) {
					res.status(404).json({
						success: false,
						message: "Image Not Found",
					});
				}
			};
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error",
		});
		console.log(error);
	}
});

//_______________________________________________________________________________________

router.get("/getAllSongs", async (req, res) => {
	try {
		let songs = await Songs.find({});
		res.json({
			success: true,
			songs,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
		console.log(error);
	}
});

router.delete("/deleteSong/:id", async (req, res) => {
	try {
		let song = await Songs.findById(req.params.id);
		if (!song) {
			return res.status(404).json({
				success: false,
				message: "Song Not Found",
			});
		}
		song.remove();
		res.json({
			success: true,
			message: "Song Deleted Successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
		console.log(error);
	}
});

module.exports = router;
