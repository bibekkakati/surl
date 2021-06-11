const events = require("events");
const updateHits = require("../controllers/handlers/updateHits");

const hitsEmitter = new events.EventEmitter();
const eventName = "UPDATE_HITS";

const updateListener = (shortUrlId, data) => {
	updateHits(shortUrlId, data);
};

const emitUpdateHits = (shortUrlId, data) => {
	hitsEmitter.emit(eventName, shortUrlId, data);
};

hitsEmitter.addListener(eventName, updateListener);

module.exports = emitUpdateHits;
