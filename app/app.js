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
    return res.send(error)
  }
  return res.send(list)
})
app.post('/save', async (req, res) => {
  if (!(req.body && req.body.url)) {return res.send(null)}

  let url = await mongodbService.save(req.body.url)
  return res.json({url})
})
app.get('/', (req, res) => {
  return res.send('Welcome to mini url!')
})

app.get('/j/*', async (req, res) => {
  const token = req.url.substr(3)
  var pair;
  try {
    pair = await mongodbService.get(token)
  } catch (error) {
    console.error(error);
    return res.json(null)
  }
  if(pair){
    let url = pair.value
    if (!HTTP_REGEX.test(url)) {
      url='http://'+url
    }
    return res.json({url})
  } else {
    return res.json(null)
  }
})

app.get('/*', async (req, res) => {
  const token = req.url.substr(1)
  var pair;
  try {
    pair = await mongodbService.get(token)
  } catch (error) {
    console.log('an error');
    // console.error(error);
    return res.send(null)
  }
  if(pair){
    let url = pair.value
    if (!HTTP_REGEX.test(url)) {
      url='http://'+url
    }
    return res.redirect(url)
  } else {
    return res.send('invalid url')
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