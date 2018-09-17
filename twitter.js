const Twit = require('twit')
const _flatten = require('lodash.flatten')
const _without = require('lodash.without')

function _sortByValue(coll) {
    return Object.keys(coll).sort((a,b) => coll[a]-coll[b]).reverse();
}

function _addCollections(cols) {
    const result = cols[0];
    cols.slice(1).forEach(col => {
        Object.keys(col).forEach(k => {
            if (!result[k]) {
                result[k] = 0;
            }
            result[k] += col[k];
        })
    });
    return result;
}
function _weightTags(tags) {
    const weightedTags = {};
    tags.forEach( t => {
        if (!weightedTags[t]) {
            weightedTags[t] = 1;
        } else {
            weightedTags[t]++;
        }
    });
    return weightedTags;
}

function collectHashTags(tweet) {
    const tags = tweet.entities.hashtags;
    if (tags) {
        return tags.map(t => t.text.toLowerCase());
    } else  {
        return [];
    }
}

function bestTagsFor(tag) {
    return new Promise( (resolve, reject) => {
        T.get('search/tweets', { q: ('#' + tag), count: 100 }, (err, data, response) => {
            if (!err) {
                const statuses = data.statuses;
                const allTags = _flatten(statuses.map(t => collectHashTags(t)));
                const bestTags = _weightTags(allTags);
                resolve(bestTags);
            } else {
                reject(err, data);
            }
        });  
    })
} 

let T;

const client = function(credentials) {
    T = new Twit({
        consumer_key:         credentials.CONSUMER_API_KEY,
        consumer_secret:      credentials.CONSUMER_API_SECRET,
        app_only_auth:        true,
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
      });

    return (tag, follow) => {
        return new Promise( (resolve, reject) => {
            bestTagsFor(tag).then(bestTags => {
                const allBestTags = _without(_sortByValue(bestTags), tag)
                    .slice(0, follow)
                    .map(t => bestTagsFor(t));
    
                Promise.all(allBestTags).then( resps => {
                    resps.push(bestTags);
                    const combined = _addCollections(resps);
                    const result = _sortByValue(combined);
                    resolve(result);
                }).catch(err => {
                    console.err(err);
                });
            })
        });
    }
    
}


module.exports = client;


  