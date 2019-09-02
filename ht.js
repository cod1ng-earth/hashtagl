#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const BestTags = require('./lib/bestTags')
const Followers = require('./lib/followers')

program.command('search <tag> [otherTags...]').action((tag, otherTags) => {
  const allTags = [tag].concat(otherTags)
  console.log('looking for ' + allTags.join(','))

  BestTags(tag, 5)
    .then(tags => {
      console.dir(tags)
    })
    .catch((err, data) => {
      console.dir(err)
      console.dir(data)
    })
})

program.command('followers <user> <filter...>').action(async (user, filter) => {
  // console.log(filter)
  const followers = await Followers(user, filter.map(f => f.toLowerCase()))
  console.dir(followers.map(f => ({
    name: f.name,
    screen_name: f.screen_name,
    location: f.location,
    description: f.description,
    url: f.url,
    twUrl: `https://twitter.com/${f.screen_name}`,
    id: f.id_str
  })))
})

program.parse(process.argv)
