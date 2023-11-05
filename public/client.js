const socket = io("http://localhost:8080/");

socket.on("connection", () => {
  console.log("Connected to server.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

var fname = prompt("Enter your name to join:");

socket.emit("new-user-joined", fname);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat.`, "right");
});

socket.on("recieve", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("exit", (data) => {
  append(`${data.name} left the chat.`, "left");
});
