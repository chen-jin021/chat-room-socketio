document.addEventListener("DOMContentLoaded", main);

//socket.io.js
//defines io function
//io function connects to the server
//optional argument - url to connect to
//connect and give back obj that represents the server

function main() {
  const socket = io();
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", sendMessage);

  //*** one more functionality: see mouse move on both browsers */
  //to track the mouse moving
  document.addEventListener("mousemove", sendMouse);
  function sendMouse(evt) {
    socket.emit("mouse", { x: evt.x, y: evt.y });
    console.log(evt.x, evt.y);
  }

  socket.on("mouse", (data) => {
    // console.log(data);
    //look for that id
    let other = document.querySelector("#" + data.id);
    if (!other) {
      other = document.createElement("div");
      other.style.position = "fixed";
      other.id = data.id;
      other.textContent = data.id;
      document.body.appendChild(other);
    }
    other.style.left = data.x + "px";
    other.style.top = data.y + "px";
  });
  function sendMessage(evt) {
    const msg = document.querySelector("#msg").value;
    //use socket.emit to send that message directly
    socket.emit("chat", { msg });
  }

  socket.on("chat", (data) => {
    document.body.appendChild(document.createElement("div")).textContent =
      data.msg;
  });

  socket.on("init", (data) => {
    console.log(data);
    for (const m of data.messages) {
      document.body.appendChild(document.createElement("div")).textContent =
        m.text;
    }
  });
}

/* first version
const socket = io();

//since we have socket.emit('hello"....) in app.js, the client side also needs to match
//on the client side, we also need to listen for this
socket.on("hello", (data) => {
  console.log(data);
  //once we used on, we can also use emit to send event
  socket.emit("response", { foo: "bar" });
});
*/
