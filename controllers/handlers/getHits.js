const DB = require("../../db/query");
const URL_STORE = require("../../store/urlStore");

const getHits = async (shortUrlId) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = URL_STORE.get(shortUrlId);
	// Cache hit
	if (data && data.hits >= 0) {
		return [data.hits, null];
	}
	//Cache miss
	const [result, error] = await DB.getUrlHits(shortUrlId);
	if (error !== null) {
		return [null, error];
	}
	return [result, null];
};

module.exports = getHits;
