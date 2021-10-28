const express = require('express')
const app = express()
const port = process.env.MINIURL_PORT || 0
const mongodbService = require('./service/mongodb/mongodbService.js')
app.use(express.json())
const HTTP_REGEX=/^(http|https):\/\//i
const HeartBeatService = require('./service/headbeat/headbeat')

app.get('/list', async (req, res) => {
  var list
  try {
    list = await mongodbService.listAll().exec()
  } catch (error) {
    res.send(error)
  }
  res.send(list)
})
app.get('/save', (req, res) => {
  mongodbService.save('www.article.com')
  res.send('save')
})
app.get('/', (req, res) => {
  res.send('Welcome to mini url!')
})

app.get('/*', async (req, res) => {
  // mongodbService.get(req)
  const token = req.url.substr(1)

  var pair;
  try {
    pair = await mongodbService.get(token).exec()
  } catch (error) {
    res.send(error)
  }
  if(pair){
    let url = pair.value
    if (!HTTP_REGEX.test(url)) {
      url='http://'+url
    }
    res.redirect(url)
  } else {
    res.send('invalid url')
  }
})

const listener = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${listener.address().port}`)
})

if (listener.address().port !== 3000) {
  HeartBeatService.config(listener)
  setInterval(() => {
    HeartBeatService.beat(function(res) {
      mongodbService.updateSliceIndex(res.pos, res.total)
    })
  },1000)
}