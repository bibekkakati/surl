const { getOriginalUrl, updateUrlHits } = require("../db/query");
const urlStore = require("../store/urlStore");

const getUrl = async (surlId) => {
	if (!surlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = urlStore.get(surlId);
	// Cache hit
	if (data && data.url && data.hits >= 0) {
		data.hits = data.hits + 1;
		updateUrlHits(surlId, data.hits, () => {
			urlStore.set(surlId, data);
		});
		return [data.url, null];
	}
	// Cache miss
	const [result, error] = await getOriginalUrl(surlId);
	if (error !== null) {
		return [null, error];
	}
	updateUrlHits(
		surlId,
		result.hits + 1,
		urlStore.set(surlId, {
			url: result.url,
			hits: result.hits + 1,
		})
	);
	return [result.url, null];
};

module.exports = getUrl;
