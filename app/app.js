const express = require('express')
const app = express()
const port = 3000
const mongodbService = require('./service/mongodb/mongodbService.js')
app.use(express.json())
const HTTP_REGEX=/^(http|https):\/\//i

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

// localhost:3000/randomKeyPath
// localhost:3000/nbzi98uadf7y7
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})