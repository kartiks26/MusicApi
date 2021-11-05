const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const { ref } = require("firebase/storage");

// Set the configuration for your app
// TODO: Replace with your app's config object
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
const storageRef = ref(storage);
const imagesRef = ref(storage, "covers");
const songsRef = ref(storage, "songs");
