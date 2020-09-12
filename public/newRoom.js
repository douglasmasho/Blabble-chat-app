const socket = io(); //default namespace

//DOM selectors
const message = document.getElementById("message"),
      handle = document.getElementById("handle"),
      btn = document.getElementById("send"),
      output = document.getElementById("output"),
      feedback = document.getElementById("feedback"),
      chatWindow = document.getElementById("chat-window"),
      form = document.getElementById("join-form"),
      roomInput = document.getElementById("room-name"),
      disconnectBtn = document.getElementById("disconnect"),
      fullChat = document.getElementById("mario-chat")



socket.on("connect", ()=>{
   console.log(socket.id)
})

//extract the room name
const roomName = localStorage.getItem("roomName");

const header = document.getElementById("room-header");

header.textContent = roomName;

let accepted;

//send request  to join the new room
socket.emit("request", roomName);
   socket.on("result", (data)=>{
        switch(data){
            case "accept": 
            console.log("you have been accepted");
            accepted = true;
                break;
            case "reject": 
                 fullChat.innerHTML = `<h2>Sorry, the room is full, you have been disconnected</h2>`,
                 disconnectBtn.textContent = "go back";
                 accepted = false;
                 disconnectBtn.addEventListener("click", ()=>{
                    window.location.href = "/";
                 })
        }
    })


 ///emit to room event
btn.addEventListener("click", ()=>{
    console.log("sent")
    socket.emit(`roomChat`, {
        message: message.value,
        handle: handle.value,
        id: socket.id,
        roomName
    })
}) 

//add event listener for typing
message.addEventListener("keypress", ()=>{
    socket.emit("roomTyping", {
        handle: handle.value,
        roomName
    });
    // clearTimeout(timeOut)
})

//add event listener for disconecting from server
disconnectBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    //send a disconnetc message to the server
    socket.emit("disct", "");
    chatWindow.innerHTML = "<h2>You have disconnected</h2>"

})



//listen for the message
socket.on("chat", data=>{
    feedback.innerHTML = "";
    let color;
    switch(data.id){
        case socket.id: color = "#69ff69";
        break;
        default: color = "none"
    }
    //this is the data coming back from the server
    output.innerHTML += `<p style="background-color: ${color}"><strong>${data.handle}:</strong> ${data.message}</p>`;
    chatWindow.scrollTo(0, chatWindow.scrollHeight);
})

//listen for typing
socket.on("roomTyping", (data)=>{
    feedback.innerHTML = `<p><em>${data.handle} is typing</em></p>`
})


