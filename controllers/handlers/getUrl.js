const SURL_DB = require("../../queries/surl_list");
const EMITTER = require("../../emitters/UrlEmitter");
const URL_STORE = require("../../store/urlStore");

const getUrl = async (shortUrlId, uniqueVisitor) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = URL_STORE.get(shortUrlId);
	// Cache hit
	if (
		data &&
		data.url &&
		data.hits >= 0 &&
		data.visitors >= 0 &&
		data.expiry
	) {
		if (isExpired(data.expiry)) {
			EMITTER.DeleteUrl(shortUrlId);
			return [null, "URL not found"];
		}
		updateHits(shortUrlId, data, uniqueVisitor);
		return [data.url, null];
	}

	// Cache miss
	const [result, error] = await SURL_DB.getOriginalUrl(shortUrlId);
	if (error !== null) {
		return [null, error];
	}

	if (isExpired(result.expiry)) {
		EMITTER.DeleteUrl(shortUrlId);
		return [null, "URL not found"];
	}
	updateHits(shortUrlId, result, uniqueVisitor);
	return [result.url, null];
};

const isExpired = (expiry) => {
	const date = new Date();
	expiry = new Date(expiry);
	return date >= expiry;
};

const updateHits = async (shortUrlId, data, uniqueVisitor = false) => {
	data.hits = data.hits + 1;
	if (uniqueVisitor) data.visitors = data.visitors + 1;
	EMITTER.UpdateUrlHits(shortUrlId, data);
	return;
};

module.exports = getUrl;
