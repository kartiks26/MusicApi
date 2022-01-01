const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const { ref } = require("firebase/storage");
const { uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
	apiKey: "AIzaSyDLj-taD0dvM6ETYt4PyNsZBWH-mZwgSdI",
	authDomain: "users-e2358.firebaseapp.com",
	projectId: "users-e2358",
	storageBucket: "users-e2358.appspot.com",
	messagingSenderId: "322018798621",
	appId: "1:322018798621:web:3306a362e605c6a29f2af4",
	storageBucket: "gs://users-e2358.appspot.com",
};
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

// Create the file metadata

const uploadFile = async (req, res, next) => {
	var file;
	if (!req.files) {
		res.send("File was not found");
		return;
	}

	file = req.files.cover;
	res.send(file);
	const metadata = {
		contentType: "image/jpeg",
	};
	const storageRef = ref(storage, "images/" + file.name);
	const uploadTask = uploadBytesResumable(
		storageRef,
		file,
		file.size,
		metadata
	);

	uploadTask.on(
		"state_changed",
		(snapshot) => {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log("Upload is " + progress + "% done");
			switch (snapshot.state) {
				case "paused":
					console.log("Upload is paused");
					break;
				case "running":
					console.log("Upload is running");
					break;
			}
		},
		(error) => {
			// A full list of error codes is available at
			// https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case "storage/unauthorized":
					// User doesn't have permission to access the object
					break;
				case "storage/canceled":
					// User canceled the upload
					break;

				// ...

				case "storage/unknown":
					// Unknown error occurred, inspect error.serverResponse
					break;
			}
		},
		() => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log("File available at", downloadURL);
				req.body.coverUrl = downloadURL;
				next();
			});
		}
	);
};
module.exports = {
	uploadFile,
};
// Listen for state changes, errors, and completion of the upload.
