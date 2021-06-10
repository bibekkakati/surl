const express = require("express");
const router = express.Router();
const { getHits, getUrl } = require("../handlers");

router.get("/", (req, res) => {
	return res.render("index");
});

router.get("/:shortUrlId/hits", async (req, res) => {
	const { shortUrlId } = req.params;
	const [hits, error] = await getHits(shortUrlId);
	if (error !== null) {
		return res.redirect(301, "/");
	}
	return res.render("pages/hits", { hits });
});

router.get("/:shortUrlId", async (req, res) => {
	const { shortUrlId } = req.params;
	const cookieName = "surl-visit-token";
	const uniqueVisitor = req.cookies[cookieName] !== shortUrlId;
	// TODO: unique visitor for analytics and track referrer and ip
	const [originalUrl, error] = await getUrl(shortUrlId);
	res.header(
		"Cache-Control",
		"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
	);
	if (error !== null) {
		return res.redirect(301, "/");
	}
	if (uniqueVisitor)
		res.cookie(cookieName, shortUrlId, {
			path: "/" + shortUrlId,
			expires: new Date(Date.now() + 63000000000), // 2 Years
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
		});
	return res.redirect(301, originalUrl);
});

module.exports = router;
