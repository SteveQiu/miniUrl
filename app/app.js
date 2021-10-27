const express = require('express')
const app = express()
const port = 3000
const mongodbService = require('./service/mongodb/mongodbService.js')


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/*', (req, res) => {
  res.send('other route')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})