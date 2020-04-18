const port        = 81
const express     = require('express')()
const bodyParser  = require('body-parser')
const server 		  = require('http').Server(express)
const mongoApi    = require('./Mongo')

express.use(bodyParser.json())

server.listen(port, function(){
  console.log(`listening port ${port}!`)
})

express.post('/database', async function(req, res) {
  const router = req.body.router
  let result
  if (router === undefined) {
    result = res.json({error: 'no router found!'})
  } else {
    result = await mongoApi.route(router, req.body)
  }
  return res.json(result)
})

