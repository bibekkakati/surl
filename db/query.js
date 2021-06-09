var axios = require("axios");

const DB_URL = process.env.DB_URL;
const BASIC_AUTH =
	"Basic " +
	Buffer.from(
		process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD
	).toString("base64");
const DB_NAME = process.env.DB_NAME;
const SURL_TABLE = "surl_table";

const DB_CONFIG = {
	method: "post",
	url: DB_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: BASIC_AUTH,
	},
};

const COL_ID = "id";
const COL_URL = "url";
const COL_HITS = "hits";
const COL_EXPIRY = "expiry";

const createTable = () => {
	const data = JSON.stringify({
		operation: "create_table",
		schema: DB_NAME,
		table: SURL_TABLE,
		hash_attribute: "id",
	});

	const config = { ...DB_CONFIG, data };

	axios(config)
		.then((response) => {
			const { message, error } = response.data;
			if (error) {
				console.log("CREATE TABLE ERROR: " + error);
			} else {
				console.log("CREATE TABLE INFO: " + message);
			}
		})
		.catch((error) => {
			console.log("CATCH CREATE TABLE ERROR: " + error.message);
		});
};

const insertUrl = async (id, url) => {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const expiry = new Date(year + 1, month, day).toUTCString();
	const hits = 0;
	const query = `INSERT INTO ${DB_NAME}.${SURL_TABLE} (${COL_ID}, ${COL_URL}, ${COL_HITS}, ${COL_EXPIRY}) VALUE ('${id}', '${url}', ${hits}, '${expiry}')`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await axios(config);
		const { inserted_hashes } = response.data;
		if (inserted_hashes.length > 0) {
			return [id, null];
		}
		return [null, null];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getOriginalUrl = async (id) => {
	const query = `SELECT ${COL_URL}, ${COL_HITS} FROM ${DB_NAME}.${SURL_TABLE} WHERE ${COL_ID}='${id}'`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await axios(config);
		const result = response.data;
		if (result.length > 0) {
			return [result[0], null];
		}
		return [null, "URL not found"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getUrlHits = async (id) => {
	const query = `SELECT ${COL_HITS} FROM ${DB_NAME}.${SURL_TABLE} WHERE ${COL_ID}='${id}'`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await axios(config);
		const result = response.data;
		if (result.length > 0) {
			return [result[0].hits, null];
		}
		return [null, "URL not found"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const updateUrlHits = async (id, hits, callback) => {
	const query = `UPDATE ${DB_NAME}.${SURL_TABLE} SET ${COL_HITS}=${hits} WHERE ${COL_ID}='${id}'`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await axios(config);
		const { update_hashes } = response.data;
		if (update_hashes.length > 0) {
			callback();
			return [hits, null];
		}
		return [null, null];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

module.exports = {
	createTable,
	insertUrl,
	getOriginalUrl,
	updateUrlHits,
	getUrlHits,
};
