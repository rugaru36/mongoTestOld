const port        = 80
const express     = require('express')()
const bodyParser  = require('body-parser')
const server 		  = require('http').Server(express)
const mongoApi    = require('./Mongo')

server.listen(port, function(){
  console.log(`listening port ${port}!`)
})

express.all('/fetch', async function(req, res) {
  const {databaseName, modelName, id, filter} = req
  let result = await mongoApi.fetch({databaseName, modelName, id, filter})
  return res.json(result)
})

express.all('/update', async function(req, res) {
  const {databaseName, modelName, values, id, filter} = req
  let result = await mongoApi.update({databaseName, modelName, values, id, filter})
  return res.json(result)
})

