const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Connected to server:", socket.id);

  // انضم لغرفة المستخدم
  socket.emit("join", "664e08c3b9186e6dd8301c1a");

  // ابعت رسالة
  socket.emit("sendMessage", {
    sender: "664e08c3b9186e6dd8301c1a",
    receiver: "664e1a22b9186e6dd8301d2f",
    text: "تجربة من سطر الأوامر"
  });
});

socket.on("newMessage", (message) => {
  console.log("📩 رسالة جديدة وصلت:", message);
});
