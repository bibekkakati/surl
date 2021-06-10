const { getOriginalUrl, updateUrlHits } = require("../../db/query");
const urlStore = require("../../store/urlStore");

const getUrl = async (shortUrlId) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = urlStore.get(shortUrlId);
	// Cache hit
	if (data && data.url && data.hits >= 0) {
		data.hits = data.hits + 1;
		updateUrlHits(shortUrlId, data.hits, () => {
			urlStore.set(shortUrlId, data);
		});
		return [data.url, null];
	}
	// Cache miss
	const [result, error] = await getOriginalUrl(shortUrlId);
	if (error !== null) {
		return [null, error];
	}
	result.hits = result.hits + 1;
	updateUrlHits(shortUrlId, result.hits, urlStore.set(shortUrlId, result));
	return [result.url, null];
};

module.exports = getUrl;
