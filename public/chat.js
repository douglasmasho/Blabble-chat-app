///make connection //we have access to the io variable beacause of the library we loaded into index.html
const socket = io();
// const
let timeOut;

// //Query dom

const message = document.getElementById("message"),
      handle = document.getElementById("handle"),
      btn = document.getElementById("send"),
      output = document.getElementById("output"),
      feedback = document.getElementById("feedback"),
      chatWindow = document.getElementById("chat-window"),
      form = document.getElementById("join-form"),
      roomInput = document.getElementById("room-name"),
      errorHeading = document.getElementById("error")

      


///emit event
btn.addEventListener("click", ()=>{
    socket.emit("chat", {
        message: message.value,
        handle: handle.value,
        id: socket.id
    })
})  

//add event listener for typing
message.addEventListener("keypress", ()=>{

    socket.emit("typing", handle.value);
    clearTimeout(timeOut)
})
//ad event listener for not typing
message.addEventListener("keyup", ()=>{
    timeOut =  setTimeout(()=>{
        socket.emit("stoppedTyping", "");
    }, 2000)
})

//listen for events
socket.on("chat", (data)=>{
    feedback.innerHTML = "";
    let color;
    switch(data.id){
        case socket.id: color = "#69ff69";
        break;
        default: color = "#00CDF6"
    }
    //this is the data coming back from the server
    output.innerHTML += `<p style="background-color: ${color}"><strong>${data.handle}:</strong> ${data.message}</p>`;
    chatWindow.scrollTo(0, chatWindow.scrollHeight);
})

//listen for the typing broadcast from the server
socket.on("typing", (data)=>{
    feedback.innerHTML = `<p><em>${data} is typing</em></p>`
})

//listen for the stopped typing broadcast from the server
socket.on("stoppedTyping", (data)=>{
    feedback.innerHTML = data;
})


socket.on("connect", ()=>{
    console.log(socket.id);
})

//read the name of the room and send a request to join room //then send them to the new page if accepted
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const roomName = roomInput.value;
    //upload to local storage;
     localStorage.setItem("roomName", `${roomName}`);
     //take them to the new page
    window.location.href = "newRoom.html";

})

// comedy.on("welcome", data=>{
//     console.log(data) 
// })