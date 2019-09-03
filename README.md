# Hashtagl

hashtagl is a twitter tool.

![hashtagl](/hashtagl.png)

Currently we're supporting two functionalities:

### bestTags
takes a hashtag as input and gets 100 "top" tweets containing that hashtag. It then parses all hashtags within these tweets and yields them ordered by frequency. In a nutshell it provides you the the "best" hashtags to use to promote a tweet / insta post. As I'm writing this,

`./ht.js search reactjs`

yields

```json
[
  'javascript',        'nodejs',              'reactjs',
  'coding',            'programming',         'vuejs',
  'python',            'angular',             'developer',
  'php',               'code',                'node',
  ...
]
``` 


### followers
 takes a user screen_name and search words. It consecutively reads the user's followers and searches their `location` and `description` fields for the search words. To find K8S users in Berlin you could e.g. parse through Kelsey Hightower's follower list like

`./ht.js followers kelseyhightower Berlin`

Note that the Twitter API is quite strongly [rate limited](https://developer.twitter.com/en/docs/basics/rate-limits) and each response only contains up to 200 results. We therefore hard limit the loop to 15 requests, allowing you to scan up to 3000 followers at once.

## Credentials

To communicate with Twitter's API you need credentials to authenticate yourself using the [Application-Only Flow](https://developer.twitter.com/en/docs/basics/authentication/overview/application-only). Copy `.env.dist` to `.env` and add them there.

## Command Line
`ht.js` is our cli tool. 

## API

`index.js` contains a simple zeit-micro server that exposes the functionality. Personally I deploy it on now.sh (see `now.json` ). Add your credentials to a local .env file and `npm run start` to start it. I added micro-dev for our convenience, try `micro-dev` for a reloaded hacking experience.

## Frontend

based on create-react-app. Add an API endpoint from above to its local `.env` file and build with `npm run start` (or `npm run build` to build the production version). You get a nice responsive, PWA ready tool to find hashtags on the go. Comes with a textfield and a copy button for quick usage. I added a `netlify.toml` so it should be deployeable to netlify without any issues. Note that the API must be deployed seperately, its endpoint can be added as a secret to Netlify's builder.

## No demo??

Since this relies on my personal credentials I'm not disclosing the URL where I deployed it. 

## opinionated choice of technology

- Yes, I'm using plain Javascript here. No I won't explain that decision. Yes, I'm fine with it
- [Bulma](https://bulma.io/) is awesome. It's actually bad. But it's awesome.
- React is better than any other frontend library. Try it.
- there are gazillions of Twitter clients in node. I chose [Twit](https://www.npmjs.com/package/twit) which is merely an authorized http wrapper. It's simple enough.
- [Zeit/Micro](https://github.com/zeit/micro) is good for simple APIs. It's not exactly made for our use case (but rather a tool for serverless deployments) but I still like it.
- [Commander](https://www.npmjs.com/package/commander) is not the most common CLI abstraction but it comes with a very intuitive command configuration. 