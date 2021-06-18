const express = require("express");
const setHeader = require("../../middlewares/setHeader");
const router = express.Router();
const { getHits, getUrl } = require("../handlers");

router.use(setHeader);

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
	const [originalUrl, error] = await getUrl(shortUrlId, uniqueVisitor);

	// Caching for 5 mins
	res.set("Cache-Control", "private, max-age=300");
	if (error !== null) {
		return res.redirect(301, "/");
	}
	if (uniqueVisitor)
		// cookie to track unqiue visit to the link
		res.cookie(cookieName, shortUrlId, {
			path: "/" + shortUrlId,
			maxAge: 63100000, // 2 Years
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
		});
	return res.redirect(301, originalUrl);
});

module.exports = router;
