const express = require("express");
const app = express();

//in the constructor Server(), we pass in our express app
const server = require("http").Server(app);

//mount a socket.io server on top of this
//this also serves up client side javascript ... /socket.io.js
const io = require("socket.io")(server);

//import and set up our database model
require("./db");
const mongoose = require("mongoose");
const Message = mongoose.model("Message");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//now implements the chat
io.on("connection", (socket) => {
  //init the page
  Message.find({}, (errr, messages) => {
    socket.emit("init", { messages });
  });

  //socket represents access to connected client
  console.log(socket.id, "has connected");

  //*** one more functionality: see mouse move on both browsers */
  //mouse event from main.js
  socket.on("mouse", (data) => {
    // console.log(data);
    //now we want all other except for the current one to see the cursor data, so:
    data.id = socket.id;
    socket.broadcast.emit("mouse", data);
  });

  //listening to the chat event from main.js
  socket.on("chat", (data) => {
    /*
      instead of console.log, it should create a new message and save to database
      so that when new browser connects to localhost:3000, it'd be able to see the messages
      */
    console.log(data);

    //--implement ^^^^
    const m = new Message({
      text: data.msg,
    });

    m.save((err, savedMessage) => {
      //io.emit --> send to all connected clients
      //socket.emit --> sneds to one client /currently connected client
      io.emit("chat", { msg: data.msg });
    });
  });
});

/* first version
//io is an object that represents your socketio server
//SERVER: server listen for connection event
io.on("connection", (socket) => {
  //socket represents access to connected client
  console.log(socket.id, "has connected");

  //io.emit --> send to all connected clients
  //socket.emit --> sneds to one client /currently connected client
  //socket.boardcast.emit --> send to clients except current one

  //hello represents an event - whatever event name you want
  socket.emit("hello", { msg: "hello there" });

  //listen to the reponse event from main.js (client side)
  socket.on("response", console.log);
});
*/
server.listen(3000); //creates an HTTP server
