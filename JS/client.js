// FAfter ignoring the home page
const socket=io(process.env.PORT||"http://localhost:8000");

const form=document.getElementById("send-form");
const messageInput=document.getElementById("input");
const messageContainer=document.querySelector(".container");
const audio=new Audio("../ding.mp3");

const append=(message,position)=>{
  const newDivElement=document.createElement("div");
  newDivElement.innerHTML="<p>"+message+"</p>";
  newDivElement.classList.add("message");
  newDivElement.classList.add(position);
  messageContainer.append(newDivElement);
  if(position=="left")
  {
    audio.play();
  }
};

const appendOnline=(name,id)=>{
  const newUser=document.createElement("p");
  newUser.classList.add(`${id}`);
  newUser.innerHTML=`<img src="https://img.icons8.com/emoji/48/000000/green-circle-emoji.png" style="width:8px;height:8px;"/> ${name}`;
  const onlineUsers=document.querySelector(".root");
  onlineUsers.append(newUser);
}

const name=prompt("Enter your name to join: ");
const room=prompt("Enter the room to join: ");
socket.emit("new-user-joined",{name,room});
var pos=0;
var flag=false;


socket.on("user-joined",name =>{
  append(`${name} joined the chat`,"right");
});
socket.on("update-onlineUsers",elem=>{
  var elemCount=1;
  for(let item in elem.y)
    {
      if(elem.users[item][0]==name &&flag==false)
        {appendOnline("You",item);pos=elemCount;flag=true;pos=elemCount;}
      else if(elemCount>pos)
        {appendOnline(elem.users[item][0],item);  pos=elemCount;}
      elemCount++;
    }

  // ReactDOM.render(<App name={name}/>,document.getElementById("root"));
});

form.addEventListener("submit",(e)=> {
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,"right");
    socket.emit("send",message);
    messageInput.value="";
});

socket.on("receive",data=>{
  append(`${data.name}: ${data.message}`,"left");
});

socket.on("left",name=>{
  append(`${name} left`,"left");
});
socket.on("remove-onlineUser",id=>{
  const elemremove=document.querySelector(`.${id}`);
  elemremove.remove();
});
