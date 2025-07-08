const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
require("dotenv").config();

// ✅ الاتصال بقاعدة البيانات
connectDB();

// ✅ إعداد Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // عدل حسب الفرونت
    credentials: true,
  },
});

// ✅ تعريف البوت كمستخدم ثابت
const chatbotUser = {
  _id: "bot_001",
  name: "Real Estate Assistant",
};

// ✅ خريطة المستخدمين المتصلين
const users = {};

// ✅ عند اتصال socket جديد
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // لما المستخدم ينضم لغرفته
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  // إرسال رسالة
  socket.on("sendMessage", async (messageData) => {
    try {
      const message = await Message.create(messageData);

      // إرسال الرسالة للمستلم
      io.to(messageData.receiver).emit("newMessage", message);

      // ✅ الرد التلقائي من الشات بوت
      if (messageData.receiver === chatbotUser._id) {
        let replyText = "👋 مرحباً! أنا مساعد العقارات. كيف يمكنني مساعدتك؟";

        // ممكن تضيف منطق أبسط للردود بناءً على الرسالة
        if (messageData.text.toLowerCase().includes("سعر")) {
          replyText = "💰 أسعار الشقق تبدأ من 500,000 جنيه.";
        } else if (messageData.text.toLowerCase().includes("موقع")) {
          replyText = "📍 نحن نغطي جميع مناطق القاهرة والإسكندرية.";
        }

        const botReply = await Message.create({
          sender: chatbotUser._id,
          receiver: messageData.sender,
          text: replyText,
        });

        io.to(messageData.sender).emit("newMessage", botReply);
      }
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
