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

	let config = { ...DB_CONFIG, data };

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

const insertUrl = (surlID, url) => {
	return new Promise((resolve, reject) => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const expiry = new Date(year + 1, month, day).toUTCString();
		const hits = 0;
		const query = `INSERT INTO ${DB_NAME}.${SURL_TABLE} (${COL_ID}, ${COL_URL}, ${COL_HITS}, ${COL_EXPIRY}) VALUE ('${surlID}', '${url}', ${hits}, '${expiry}')`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const { inserted_hashes } = response.data;
				if (inserted_hashes.length > 0) {
					return resolve(surlID);
				} else {
					return resolve(null);
				}
			})
			.catch((error) => {
				console.log("INSERT ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const getOriginalUrl = (surlID) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT ${COL_URL}, ${COL_HITS} FROM ${DB_NAME}.${SURL_TABLE} WHERE ${COL_ID}='${surlID}'`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const result = response.data;
				if (result.length > 0) {
					return resolve(result[0]);
				}
				return reject("URL not found");
			})
			.catch((error) => {
				console.log("GET ORIGINAL URL ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const getUrlHits = (surlID) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT ${COL_HITS} FROM ${DB_NAME}.${SURL_TABLE} WHERE ${COL_ID}='${surlID}'`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const result = response.data;
				if (result.length > 0) {
					return resolve(result[0].hits);
				}
				return reject("URL not found");
			})
			.catch((error) => {
				console.log("GET URL HITS ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const updateUrlHits = (surlId, hits) => {
	const query = `UPDATE ${DB_NAME}.${SURL_TABLE} SET ${COL_HITS}=${hits} WHERE ${COL_ID}='${surlId}'`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	let config = { ...DB_CONFIG, data };

	axios(config)
		.then((response) => {})
		.catch((error) => {
			console.log("UPDATE HITS ERROR: " + error.message);
		});
};

module.exports = {
	createTable,
	insertUrl,
	getOriginalUrl,
	updateUrlHits,
	getUrlHits,
};
