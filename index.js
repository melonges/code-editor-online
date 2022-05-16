const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require("fs")
const port = process.env.PORT || 3000;
let userCounter = 0;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let ACTUAL_MSG;
io.on('connection', (socket) => {
  userCounter += 1
  console.log(userCounter)
  io.emit("change online", userCounter)
  socket.emit("chat message", ACTUAL_MSG)
  socket.on("change lang", lang => {io.emit("change lang", lang)})
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    ACTUAL_MSG = msg
  });
  socket.on('disconnect', _ => {
    userCounter -= 1
    console.log(userCounter)
    io.emit("change online", userCounter)
    console.log(`user disconnected. All users: ${userCounter}`);
  });
});

setInterval(() => {
  if (userCounter) {
    let data = JSON.stringify({"lastMessage": ACTUAL_MSG});
    fs.writeFileSync('lastMessage.json', data);
  }
}, 5000)
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
  const rawdata = fs.readFileSync('lastMessage.json');
  const {lastMessage} = JSON.parse(rawdata);
  ACTUAL_MSG = lastMessage
});
