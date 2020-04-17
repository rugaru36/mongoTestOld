const port        = 81
const express     = require('express')()
const bodyParser  = require('body-parser')
const server 		  = require('http').Server(express)
const mongoApi    = require('./Mongo')

express.use(bodyParser.json())

server.listen(port, function(){
  console.log(`listening port ${port}!`)
})

express.post('/fetch', async function(req, res) {
  const {databaseName, modelName, id, filter} = req.body
  let result = await mongoApi.fetch({databaseName, modelName, id, filter})
  return res.json(result)
})

express.post('/update', async function(req, res) {
  const {databaseName, modelName, values, id, filter} = req.body
  let result = await mongoApi.update({databaseName, modelName, values, id, filter})
  return res.json(result)
})

