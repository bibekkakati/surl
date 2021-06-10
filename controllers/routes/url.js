const express = require("express");
const router = express.Router();

const { getShortUrl } = require("../handlers");

router.get("/short", async (req, res) => {
	const { url } = req.query;
	const [data, error] = await getShortUrl(url);
	if (error !== null) {
		return res.status(200).send({
			success: false,
			error: error,
		});
	}
	const shortUrl = req.protocol + "://" + req.get("host") + "/" + data;
	return res.status(200).send({
		success: true,
		url: shortUrl,
	});
});

module.exports = router;
