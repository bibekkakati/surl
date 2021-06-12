const DB = require("../../db/query");
const URL_STORE = require("../../store/urlStore");

const deleteUrl = async (shortUrlId) => {
	URL_STORE.del(shortUrlId);
	const [ok, error] = await DB.deleteUrl(shortUrlId);
	if (error !== null) {
		// Log error
	}
	return;
};

module.exports = deleteUrl;
