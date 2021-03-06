const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.querySelector("#users");

// Getting username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Initializing socket
const socket = io();

// Join Chatroom
socket.emit("joinRoom", { username, room });

// Get Room and Users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Read Messages From Server
socket.on("message", (message) => {
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", message);

  // clear message input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output Message To DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
    `;
  chatMessages.appendChild(div);
};

// Display Room Name
function outputRoomName(roomName) {
  document.querySelector("#room-name").innerHTML = roomName;
}

// Display Users
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
