const port        = 80
const express     = require('express')()
const bodyParser  = require('body-parser')
const server 		  = require('http').Server(express)
const mongoApi    = require('./Mongo')

server.listen(port, function(){
  console.log(`listening port ${port}!`)
})

express.all('/test', function(req, res){
  return res.json('test answer!')
})
