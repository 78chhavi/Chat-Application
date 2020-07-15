const io=require("socket.io")(8000);
const fs=require("fs");
// var express=require('express');
// var app = express();
// const bodyParser=require("body-parser");
// const ejs = require("ejs");
//
// app.set('view engine', 'ejs');
// var http = require('http').Server(app);
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));


var users={}

io.on("connection",socket=>{

  socket.on("new-user-joined",data=>{
    var userRoom=[data.name,data.room];
    users[socket.id]=userRoom;
    socket.join(data.room);
    var list =io.nsps['/'].adapter.rooms[data.room];
    var y=list.sockets;
    socket.broadcast.to(data.room).emit('user-joined', data.name);
    io.in(data.room).emit('update-onlineUsers', {y,users});
  })
  socket.on("send",message=>{
        socket.broadcast.to(users[socket.id][1]).emit("receive",{message:message,name:users[socket.id][0]});
  })
  socket.on("disconnect",message=>{
    var id=socket.id;
    var name=users[socket.id][0];
    socket.broadcast.to(users[socket.id][1]).emit("left",name)
    io.in(users[socket.id][1]).emit('remove-onlineUser', id);
    delete name;
  })
});

// http.listen(2000,()=>{
//   console.log("Server started");
// });
//
// app.get("/",(req,res)=>{
//   // res.sendFile("C:/Users/user/Desktop/Chat Application/Client/home.html");
//   res.sendFile("C:/Users/user/Desktop/Chat Application/Client/index.html");
// });
//
// app.post("/",(req,res)=>{
//   const name=req.body.inputname;
//   const room=req.body.room;
//   res.sendFile("C:/Users/user/Desktop/Chat Application/Client/index.html");
// });
