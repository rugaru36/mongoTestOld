const port        = 80
const app         = require('express')()
const bodyParser  = require('body-parser')
const server 		  = require('http').Server(app)
const mongoApi    = require('./Mongo')

server.listen(port, function(){
  console.log(`listening port ${port}!`)
})

app.all('/test', function(req, res){
  return res.json('test answer!')
})

console.log(mongoApi.parseFilter("prop == value && prop == value"))