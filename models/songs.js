const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const song = new Schema({
	title: {
		type: String,
		required: true,
	},

	cover: {
		type: String,
		// required: true,
	},
	artist: {
		type: String,
	},
	SongUrl: {
		type: String,
		// required: true,
	},
});

const songs = mongoose.model("Songs", song);

module.exports = songs;
