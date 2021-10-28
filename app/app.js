const express = require('express')
const app = express()
const port = 3000
const mongodbService = require('./service/mongodb/mongodbService.js')
app.use(express.json())

app.get('/list', (req, res) => {
  const list = mongodbService.listAll()
  // console.log(list)
  res.send('list all')
  // res.send(list)
})
app.get('/save', (req, res) => {
  mongodbService.save('www.article7.com')
  // mongodbService.save('www.article6.com')
  res.send('save')
})
app.get('/', (req, res) => {
  res.send('Welcome to mini url!')
})

// localhost:3000/randomKeyPath
// localhost:3000/nbzi98uadf7y7
app.get('/*', (req, res) => {
  res.send('get and redirect to another site')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})