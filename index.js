const express = require("express");
const path = require("path");
const socket = require("socket.io");


//App setup
const app = express();

const server = app.listen(5000, ()=>{
    console.log("listening to request on port 5000")
});


//static files
app.use(express.static(path.join(__dirname, "public")));

//socket setup
//arg is the server you want the socket to work with.
const io = socket(server);

//listen for connection
io.on("connection", (socket)=>{
    console.log("made socket connection", socket.id);

    //listen for a message sent from the client
    socket.on("chat", (data)=>{
        //send data to all the clients connected to this server
        io.sockets.emit("chat", data);
        //first arg=> name of the data;
        //second arg=> actual data
    });

    //listen for the typing message from the client
    socket.on("typing", (data)=>{
        //bradcast the message
        socket.broadcast.emit("typing", data)
    })

    socket.on("stoppedTyping", (data)=>{
        socket.broadcast.emit("stoppedTyping", data)
    })
})
