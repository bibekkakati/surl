const noCache = (req, res, next) => {
	res.set("Cache-Control", "noCache");
	next();
};

module.exports = noCache;
