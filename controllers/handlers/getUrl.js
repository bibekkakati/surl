const DB = require("../../db/query");
const EMITTER = require("../../emitters/UrlEmitter");
const URL_STORE = require("../../store/urlStore");

const getUrl = async (shortUrlId) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = URL_STORE.get(shortUrlId);
	// Cache hit
	if (data && data.url && data.hits >= 0 && data.expiry) {
		if (isExpired(data.expiry)) {
			EMITTER.DeleteUrl(shortUrlId);
			return [null, "URL not found"];
		}
		data.hits = data.hits + 1;
		EMITTER.UpdateUrlHits(shortUrlId, data);
		return [data.url, null];
	}

	// Cache miss
	const [result, error] = await DB.getOriginalUrl(shortUrlId);
	if (error !== null) {
		return [null, error];
	}

	if (isExpired(result.expiry)) {
		EMITTER.DeleteUrl(shortUrlId);
		return [null, "URL not found"];
	}

	result.hits = result.hits + 1;
	URL_STORE.set(shortUrlId, result);
	EMITTER.UpdateUrlHits(shortUrlId, result);
	return [result.url, null];
};

const isExpired = (expiry) => {
	const date = new Date();
	expiry = new Date(expiry);
	return date >= expiry;
};

module.exports = getUrl;
