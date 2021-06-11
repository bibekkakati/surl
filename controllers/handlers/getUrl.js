const { getOriginalUrl } = require("../../db/query");
const emitUpdateHits = require("../../events/hits");
const URL_STORE = require("../../store/urlStore");

const getUrl = async (shortUrlId) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = URL_STORE.get(shortUrlId);
	// Cache hit
	if (data && data.url && data.hits >= 0) {
		data.hits = data.hits + 1;
		emitUpdateHits(shortUrlId, data);
		return [data.url, null];
	}
	// Cache miss
	const [result, error] = await getOriginalUrl(shortUrlId);
	if (error !== null) {
		return [null, error];
	}
	result.hits = result.hits + 1;
	emitUpdateHits(shortUrlId, result);
	return [result.url, null];
};

module.exports = getUrl;
