const events = require("events");
const updateHits = require("../controllers/handlers/updateHits");
const deleteUrl = require("../controllers/handlers/deleteUrl");

const UrlEmitter = new events.EventEmitter();
const UPDATE_HITS = "UPDATE_HITS";
const DELETE_URL = "DELETE_URL";

// Update Hits Listener
const updateListener = async (shortUrlId, data) => {
	updateHits(shortUrlId, data);
};
UrlEmitter.addListener(UPDATE_HITS, updateListener);

// Delete URL Listener
const deleteListener = async (shortUrlId) => {
	deleteUrl(shortUrlId);
};
UrlEmitter.addListener(DELETE_URL, deleteListener);

// Emitters
const UpdateUrlHits = async (shortUrlId, data) => {
	UrlEmitter.emit(UPDATE_HITS, shortUrlId, data);
};
const DeleteUrl = async (shortUrlId) => {
	UrlEmitter.emit(DELETE_URL, shortUrlId);
};

module.exports = {
	UpdateUrlHits,
	DeleteUrl,
};
