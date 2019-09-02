const T = require('./Client')
const _flatten = require('lodash.flatten')
const _without = require('lodash.without')

function _sortByValue (coll) {
  return Object.keys(coll).sort((a, b) => coll[a] - coll[b]).reverse()
}

function _addCollections (cols) {
  const result = cols[0]
  cols.slice(1).forEach(col => {
    Object.keys(col).forEach(k => {
      if (!result[k]) {
        result[k] = 0
      }
      result[k] += col[k]
    })
  })
  return result
}
function _weightTags (tags) {
  const weightedTags = {}
  tags.forEach(t => {
    if (!weightedTags[t]) {
      weightedTags[t] = 1
    } else {
      weightedTags[t]++
    }
  })
  return weightedTags
}

function collectHashTags (tweet) {
  const tags = tweet.entities.hashtags
  if (tags) {
    return tags.map(t => t.text.toLowerCase())
  } else {
    return []
  }
}

function bestTagsFor (tag) {
  return new Promise((resolve, reject) => {
    T.get('search/tweets', { q: ('#' + tag), count: 100 }, (err, data, response) => {
      if (!err) {
        const statuses = data.statuses
        const allTags = _flatten(statuses.map(t => collectHashTags(t)))
        const bestTags = _weightTags(allTags)
        resolve(bestTags)
      } else {
        reject(err, data)
      }
    })
  })
}

module.exports = async (tag, follow) => {
  const bestTags = await bestTagsFor(tag)

  const allBestTagsPromises = _without(_sortByValue(bestTags), tag)
    .slice(0, follow)
    .map(t => bestTagsFor(t))

  try {
    const resps = await Promise.all(allBestTagsPromises)
    resps.push(bestTags)
    const combined = _addCollections(resps)
    const result = _sortByValue(combined)
    return result
  } catch (err) {
    console.err(err)
  }
}
