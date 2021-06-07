require("dotenv").config();
const express = require("express");
const path = require("path");
const { createTable } = require("./db/query");
const getUrl = require("./handlers/getUrl");
const shortenUrl = require("./handlers/shortenUrl");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, "./public")));

app.get("/surl", async (req, res) => {
	const { url } = req.query;
	try {
		let surl = await shortenUrl(url);
		return res.status(200).send({
			success: true,
			url: surl,
		});
	} catch (error) {
		return res.status(200).send({
			success: false,
			error: error,
		});
	}
});

app.get("/:surlId", async (req, res) => {
	const { surlId } = req.params;
	try {
		let originalUrl = await getUrl(surlId);
		return res.status(301).redirect(originalUrl);
	} catch (error) {
		return res.status(301).redirect("/");
	}
});

app.listen(PORT, () => {
	createTable();
	console.log("Server is running at http://localhost:" + PORT);
});
