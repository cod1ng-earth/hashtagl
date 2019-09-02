const T = require('./Client')

module.exports = async (screenName, search, cursor) => {
  let followers = []
  try {
    const _user = await T.get('users/show', { screen_name: screenName })
    const user = _user.data

    const maxLoops = 20
    let loop = 0

    while (loop++ < maxLoops && cursor !== 0) {
      const _followers = await T.get('followers/list', { user_id: user.id_str, count: 200, cursor })
      cursor = _followers.data.next_cursor
      console.log(cursor)
      /* const _followers = {
        data: {
          users: [
            { id: 1, location: 'Leipzig', description: 'Bretschn' },
            { id: 2, location: 'Berlin', description: 'Schrippe' }
          ]
        }
      } */

      const users = _followers.data.users.filter(user => {
        let found = false
        search.forEach(s => {
          found = found || (user.location.toLowerCase().indexOf(s) >= 0 || user.description.toLowerCase().indexOf(s) >= 0)
        })
        return found
      })
      followers = followers.concat(users)
    }
  } catch (exc) {
    console.log(exc)
  }
  return followers
}
