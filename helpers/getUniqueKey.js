const { customAlphabet } = require("nanoid");

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(CHARS, 6);

const getUniqueKey = async () => nanoid();

module.exports = getUniqueKey;
