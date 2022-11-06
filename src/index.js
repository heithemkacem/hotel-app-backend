const server = require('./server')
//server port 
const port= process.env.PORT || 5000
//starting the server
const startServer=  ()=>{
    server.listen(port,()=>{
        console.log(`server running on port ${port}`)
    })
}
startServer()