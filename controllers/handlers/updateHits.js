const { updateUrlHits } = require("../../db/query");
const URL_STORE = require("../../store/urlStore");

const updateHits = async (shortUrlId, data) => {
	const [ok, error] = await updateUrlHits(shortUrlId, data.hits);
	if (error !== null) {
		// Log error
		return;
	}
	URL_STORE.set(shortUrlId, data);
};

module.exports = updateHits;
