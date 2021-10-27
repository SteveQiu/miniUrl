'use strict'

const autocannon = require('autocannon')
const url = 'http://localhost:3000'

autocannon({
    url,
    // amount: 20,
    requests: [
        {
                method: 'POST', // POST for creating a product
                path: '/save',
                body: JSON.stringify({url:'www.article.com'}),
                onResponse: (status, body, context) => {
                if (status === 200) {
                    context.product = JSON.parse(body)
                } // on error, you may abort the benchmark
            }
        },
        {
            method: 'GET',
            path: '/list',
            setupRequest: (req, context) => {
                req.body = JSON.stringify({})
                return req
            }
        }
    ]
}, console.log)