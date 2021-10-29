const express = require('express')
const app = express()
const ServerInfo = require('./ServerInfo')
const port = 3000
const axios = require('axios');
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
  let index = -1
  if (req.body) {
    let sName = 'http://localhost:'+ req.body.name
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
  return res.json({pos:index, total:registeredApp.length});
})
app.get('/favicon.ico', function(){})

app.get('/list', async (req, res) => {
  let pos = Math.floor(Math.random()*100000000)%registeredApp.length
  if(!registeredApp[pos]) return res.send('servers down')
  let redirectUrl = registeredApp[pos].name+req.path

  try {
    let r = await axios.get(redirectUrl)  
    if (r.data) return  res.json(r.data)
  } catch (error) {
    console.error(error);
    res.send('error')
  }

})
app.get('/', async (req, res) => {
  let pos = Math.floor(Math.random()*100000000)%registeredApp.length
  let redirectUrl = registeredApp[pos].name+req.path
  res.redirect(307, redirectUrl);
})

app.get('/*', async (req, res) => {
  Promise.allSettled([...registeredApp.map(serverInfo=>{
    let redirectUrl = `${serverInfo.name}/j${req.path}`
    return axios.get(redirectUrl)
  })]).then(urlObjs=>{
    for (const obj of urlObjs) {
      if (obj.value && obj.value.data && obj.value.data.url) {
        return res.redirect(307, obj.value.data.url)
        
      }
    }
    return res.send('not found')
  })
})

app.post('/*', async (req, res) => {
  let pos = Math.floor(Math.random()*100000000)%registeredApp.length
  let redirectUrl = registeredApp[pos].name+req.path
  try {
    let r = await axios.post(redirectUrl, req.body)
    res.json(r.data)
  } catch (error) {
    console.error(error);
    res.send('error')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})