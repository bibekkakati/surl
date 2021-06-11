const request = require("../config/request");
const DB_CONFIG = require("../config/database");

const DB_NAME = "surls";
const SURL_TABLE = "surl_table";

const COL_ID = "id";
const COL_URL = "url";
const COL_HITS = "hits";
const COL_EXPIRY = "expiry";

const createTable = async () => {
	const data = JSON.stringify({
		operation: "create_table",
		schema: DB_NAME,
		table: SURL_TABLE,
		hash_attribute: "id",
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
		const { message, error } = response.data;
		if (error) {
			console.log("CREATE TABLE ERROR: " + error);
		} else {
			console.log("CREATE TABLE INFO: " + message);
		}
	} catch (error) {
		console.log("CATCH CREATE TABLE ERROR: " + error.message);
	}
};

const insertUrl = async (id, url) => {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const expiry = new Date(year + 1, month, day).toUTCString();
	const hits = 0;
	const data = JSON.stringify({
		operation: "insert",
		schema: DB_NAME,
		table: SURL_TABLE,
		records: [
			{
				[COL_ID]: id,
				[COL_URL]: url,
				[COL_HITS]: hits,
				[COL_EXPIRY]: expiry,
			},
		],
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
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
	const data = JSON.stringify({
		operation: "search_by_hash",
		schema: DB_NAME,
		table: SURL_TABLE,
		hash_values: [id],
		get_attributes: [COL_URL, COL_HITS],
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
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
	const data = JSON.stringify({
		operation: "search_by_hash",
		schema: DB_NAME,
		table: SURL_TABLE,
		hash_values: [id],
		get_attributes: [COL_HITS],
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
		const result = response.data;
		if (result.length > 0) {
			return [result[0].hits, null];
		}
		return [null, "URL not found"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const updateUrlHits = async (id, hits) => {
	const data = JSON.stringify({
		operation: "update",
		schema: DB_NAME,
		table: SURL_TABLE,
		records: [
			{
				[COL_ID]: id,
				[COL_HITS]: hits,
			},
		],
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
		const { update_hashes } = response.data;
		if (update_hashes.length > 0) {
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
