#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const BestTags = require('./lib/bestTags')

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

program.command('followers <user> [filter...]').action((user, filter) => {
  console.log(user, filter)
})

program.parse(process.argv)
