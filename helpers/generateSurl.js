const { customAlphabet } = require("nanoid");

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const getSurl = () => {
	const nanoid = customAlphabet(CHARS, 6);
	return nanoid();
};

module.exports = getSurl;
