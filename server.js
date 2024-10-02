const express = require('express')
var socket = require('socket.io')
const path = require('path')
const app = express()
var online_users = []

var server = app.listen(3000, (req, res)=> {
    console.log('Chat server sarted at port 3000 ...')
})
var io = socket(server)

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/client.html')
})
io.on('connection', (socket)=>{
    socket.on('chatJoined', (name)=>{
        socket.name = name
        online_users.push({name:socket.name, id: socket.id})
        //console.log(online_users)
        //io.emit('broadcastMessage',name+ " Just joined the chat ...")
        socket.broadcast.emit('broadcastMessage',name+ " Just joined the chat ...")
        io.emit('updateMenu',online_users)
    })
socket.on('clientMessage', function(data){
        //io.emit('serverMessage',socket.name+" Says ... "+ data)
        //socket.broadcast.emit('serverMessage',socket.name+" Says ... "+ data)
        io.of("/").to(data.id).emit('serverMessage',socket.name+" Says ... "+ data.message)
    })
})
