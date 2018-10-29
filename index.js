require("dotenv").config();
const { send } = require("micro");
const microCors = require("micro-cors");
const cors = microCors();

const URL = require("url");
const QS = require("querystring");
const Cache = require("cache");

const TwSearch = require("./twitter")({
  CONSUMER_API_KEY: process.env.CONSUMER_API_KEY,
  CONSUMER_API_SECRET: process.env.CONSUMER_API_SECRET
});

const CACHE_TTL = 3600 * 1000;

const cache = new Cache(CACHE_TTL);

const demoData = {
  tags: ["some", "nice", "hash", "tags"]
};

module.exports = cors((req, res) => {
  const url = URL.parse(req.url);
  const qs = QS.parse(url.query);
  if (qs.demo == "true") {
    return send(res, 200, demoData);
  }
  if (!qs.tag || qs.tag.length < 2) {
    return send(res, 500, "pls give a tag");
  }

  let cached = cache.get(qs.tag);
  if (cached) {
    return send(res, 200, cached);
  }

  console.log(`looking up ${qs.tag}`);

  TwSearch(qs.tag, 5)
    .then(tags => {
      cache.put(qs.tag, { tags });
      send(res, 200, { tags });
    })
    .catch((err, data) => {
      send(res, 500, err);
    });
});
