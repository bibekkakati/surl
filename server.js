require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { createTable } = require("./db/query");
const { getShortUrl, getUrl, getHits } = require("./handlers");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "development"
				? "http://localhost:" + PORT
				: "https://ursurl.herokuapp.com",
		optionsSuccessStatus: 200,
		methods: ["GET"],
		maxAge: 3 * 60,
	})
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
	express.static(path.join(__dirname, "/views/static"), {
		maxAge: 10 * 24 * 60 * 60 * 1000,
	})
);

app.get("/", (req, res) => {
	return res.render("index");
});

app.get("/api/surl", async (req, res) => {
	const { url } = req.query;
	try {
		let surl = await getShortUrl(url);
		surl = req.protocol + "://" + req.get("host") + "/" + surl;
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
		return res.redirect(302, originalUrl);
	} catch (error) {
		return res.redirect(302, "/");
	}
});

app.get("/:surlId/hits", async (req, res) => {
	const { surlId } = req.params;
	try {
		let hits = await getHits(surlId);
		return res.render("pages/hits", { hits });
	} catch (error) {
		return res.redirect(302, "/");
	}
});

app.listen(PORT, () => {
	createTable();
	console.log("Server is running at http://localhost:" + PORT);
});
