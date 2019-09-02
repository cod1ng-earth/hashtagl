require('dotenv').config()

const { send } = require('micro')
const microCors = require('micro-cors')
const cors = microCors()

const URL = require('url')

const bestTags = require('./routes/bestTags')

module.exports = cors(async (req, res) => {
  const url = URL.parse(req.url)
  switch (url.pathname) {
    case '/tags/': return bestTags(req, res)
    default: send(res, 404, { err: 'notfound' })
  }
  console.log(url)
})
