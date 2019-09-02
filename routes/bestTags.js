const URL = require('url')
const QS = require('querystring')
const { send } = require('micro')
const Cache = require('cache')
const BestTags = require('../lib/bestTags')

const CACHE_TTL = 3600 * 1000
const cache = new Cache(CACHE_TTL)

const demoData = {
  tags: ['some', 'nice', 'hash', 'tags']
}

module.exports = async (req, res) => {
  const url = URL.parse(req.url)
  const qs = QS.parse(url.query)

  if (qs.demo === 'true') {
    return send(res, 200, demoData)
  }

  if (!qs.tag || qs.tag.length < 2) {
    return send(res, 500, 'pls give a tag')
  }

  const cached = cache.get(qs.tag)
  if (cached) {
    return send(res, 200, cached)
  }

  console.log(`looking up ${qs.tag}`)

  try {
    const tags = await BestTags(qs.tag, 5)
    cache.put(qs.tag, { tags })
    send(res, 200, { tags })
  } catch (err) {
    send(res, 500, err)
  }
}
