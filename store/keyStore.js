const { getKeys } = require("../services/keygen/action");

var KEY_STORE = [];
var requestState = false;

const get = async () => {
	if (KEY_STORE.length <= 0 && !requestState) {
		requestState = true;
		const [keys, error] = await getKeys();
		if (error !== null) {
			requestState = false;
			console.error("GET KEYS ERROR: ", error);
			return null;
		}
		KEY_STORE = keys;
		requestState = false;
	}
	return KEY_STORE.pop() || null;
};

module.exports = {
	get,
};
