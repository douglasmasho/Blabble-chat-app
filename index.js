const express = require("express");
const path = require("path");
const socket = require("socket.io");

//App setup
const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, ()=>{
    console.log("listening to request on port" + PORT)
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
        //io.emit emits to the default namespaces;
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

     ///room chat
     const rooms = {}
    socket.on("request", (name)=>{
        const accept = (name)=>{
            socket.join(name); //make the client join a room
            // console.log(io.sockets.adapter.rooms[name].length);
            socket.emit("result", "accept")
            
            socket.to(name).emit("attention", socket.id);
            socket.emit("welcome", io.sockets.adapter.rooms[name]);  
        }

        if(!io.sockets.adapter.rooms[name]){
            accept(name)
        }else{
            if(io.sockets.adapter.rooms[name].length < 9){
                accept(name)
            }else{
                console.log("rejected");
                socket.emit("result", "reject"); 
                socket.disconnect();
            }
        }
    })

    ///listen for room message from client
    socket.on("roomChat", (data)=>{
        console.log("message received", data)
        const roomName = data.roomName;
        io.in(roomName).emit("chat", data);
    })

    //listen for room typing message
    socket.on("roomTyping", data=>{
        socket.to(data.roomName).emit("roomTyping",data);
    })
   //listen for disconnect message
    socket.on("disct", ()=>{
        socket.disconnect();
    })
    //find out the rooms of the user when the user disconnects

    socket.on("disconnecting", ()=>{
        console.log("user has disconnected")
        console.log(Object.keys(socket.rooms))
    });
});


//create a comedy namespace

// io.of("/comedy").on("connection", (socket)=>{
//     socket.emit("welcome" ,"welcome to the comedy spaces!");

//     socket.on("joinRoom", (room)=>{
//         //join a person into a room
//         if(gameRooms.includes(room)){
//             socket.join(room)
//         }else{

//         }
//     })
// })

