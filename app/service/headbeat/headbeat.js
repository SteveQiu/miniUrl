const http = require('http');
const https = require('https');
var data;
var hostPort;
const options = {
    host: 'localhost',
    port: 3000,
    path: '/register',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
};

function config(appListener) {
    hostPort = appListener.address().port
    data = JSON.stringify({name:hostPort})
    options.headers['Content-Length'] = data.length
}

function beat(cb) {
    return new Promise((resolve, reject)=>{
        const port = options.port == 443 ? https : http;
        
        let output = "";
        
        const req = port.request(options, (res) => {
            res.setEncoding("utf8");
        
            res.on("data", (chunk) => {output += chunk;});
        
            res.on("end", () => {
                    let obj = JSON.parse(output);
                    cb(obj);
                    resolve(obj)
                });
            });
        
            req.on("error", (err) => {
                console.error(err);
            });
            req.write(data)
            req.end();
    })
};


module.exports= {
    beat,
    config,
}
