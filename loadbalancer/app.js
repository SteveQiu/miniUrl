const express = require('express')
const app = express()
const ServerInfo = require('./ServerInfo')
const port = 3000
let registeredApp = []

setInterval(() => {
  let now = new Date()
  registeredApp = registeredApp.filter(serverInfo=>{
    return serverInfo.isInactive(now)
  })
  console.log(`alive host count ${registeredApp.length}`);
}, 4000)

app.use(express.json())

app.post('/register', async (req, res) => {
  // console.log(req.socket.remoteAddress);
  // console.log(req.socket.remotePort);
  // console.log(req.body);
  let index = -1
  if (req.body) {
    let sName = req.body.name
    registeredApp.forEach((info,i)=>{
      if (info.isSameHost(sName)) {
        info.refresh()
        index=i
      }
    })
    if (index==-1) {
      registeredApp.push(new ServerInfo(sName))
      console.log('register new server ', sName);
      index = registeredApp.length-1
    }
  }
  res.json({pos:index, total:registeredApp.length});
})

app.get('/*', async (req, res) => {
  console.log(req.path);
  res.redirect(307, req.path)
})
app.post('/*', async (req, res) => {
  console.log(req.path);
  res.redirect(307, req.path);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})