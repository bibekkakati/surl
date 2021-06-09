require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { createTable } = require("./db/query");
const { getShortUrl, getUrl, getHits } = require("./handlers");

const PORT = process.env.PORT || 5000;
const app = express();

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10,
});
app.use("/api/", apiLimiter);
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
app.enable("trust proxy");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
	express.static(path.join(__dirname, "/public"), {
		maxAge: 10 * 24 * 60 * 60 * 1000,
	})
);

app.get("/", (req, res) => {
	return res.render("index");
});

app.get("/api/surl", async (req, res) => {
	const { url } = req.query;
	const [data, error] = await getShortUrl(url);
	if (error !== null) {
		return res.status(200).send({
			success: false,
			error: error,
		});
	}
	const surl = req.protocol + "://" + req.get("host") + "/" + data;
	return res.status(200).send({
		success: true,
		url: surl,
	});
});

app.get("/:surlId", async (req, res) => {
	const { surlId } = req.params;
	const [originalUrl, error] = await getUrl(surlId);
	if (error !== null) {
		return res.redirect(302, "/");
	}
	return res.redirect(302, originalUrl);
});

app.get("/:surlId/hits", async (req, res) => {
	const { surlId } = req.params;
	const [hits, error] = await getHits(surlId);
	if (error !== null) {
		return res.redirect(302, "/");
	}
	return res.render("pages/hits", { hits });
});

app.listen(PORT, () => {
	createTable();
	console.log("Server is running at http://localhost:" + PORT);
});
