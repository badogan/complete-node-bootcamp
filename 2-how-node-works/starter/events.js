const EventEmitter = require('events')
const http = require('http')

class Sales extends EventEmitter {
    constructor() {
        super();

    }
}

const myEmitter = new Sales()

myEmitter.on('newSale', ()=>{
    console.log('There was a new sale!')
})

myEmitter.on('newSale', ()=>{
    console.log('Customer name Jonas')
})

myEmitter.on('newSale', (stock)=>{
    console.log(`there are ${stock} items left in the stock`)
})

myEmitter.emit('newSale', 9)

// //

const server = http.createServer()

server.on('request',(request,response)=>{
    console.log('request received: ')
    console.log(request.url)
    response.end("request received")
})
server.on('request',(request,response)=>{
    response.end("another request received :)")
})
server.on('close',()=>{
    console.log('server closed')
})

server.listen(8000,'127.0.0.1', ()=>{console.log('waiting for requests')})

